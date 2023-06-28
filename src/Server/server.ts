import { ProcedureBuilder, initTRPC } from "@trpc/server";
import { boolean, date, string, z } from "zod";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import http from "http";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;
const db = new Database("bellDatabase.db", {
  verbose: console.log,
});
const saltRounds = 10;

const appRouter = router({
  users: publicProcedure
    .output(
      z.array(
        z.object({
          id: z.number(),
          username: z.string(),
          password: z.string(),
          lastLogin: z.string(),
        })
      )
    )
    .query(() => {
      caller.deleteLoginCode();
      return db.prepare("SELECT * FROM users;").all() as any;
    }),
  emptyDatabase: publicProcedure
    .input(z.enum(["users", "ringSchedule"]))
    .mutation(({ input }) => {
      caller.deleteLoginCode();
      if (input === "users") db.prepare("DELETE FROM users;").run();
      else if (input === "ringSchedule")
        db.prepare("DELETE FROM ringSchedule;").run();
    }),
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .output(z.boolean())
    .mutation(async ({ input }) => {
      caller.deleteLoginCode();
      let success = false;
      let dbPassword = db
        .prepare("SELECT password FROM users WHERE username = ?;")
        .get(input.username) as any;
      success = await bcrypt.compare(
        input.password === "" ? "1" : input.password,
        dbPassword ? dbPassword.password : "0"
      );
      return success;
    }),
  addUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        lastLogin: z.string(),
      })
    )
    .mutation(({ input }) => {
      caller.deleteLoginCode(true);
      bcrypt.hash(input.password, saltRounds, function (err, hash) {
        db.prepare(
          "INSERT INTO users (id, username, password, lastLogin) VALUES (?, ?, ?, ?);"
        ).run(
          (db.prepare("SELECT MAX(id) AS latestUser FROM users;").get()! as any)
            .latestUser + 1,
          input.username,
          hash,
          input.lastLogin
        );
      });
      return true;
    }),
  isAlreadySigned: publicProcedure
    .input(z.object({ username: z.string() }))
    .output(z.boolean())
    .mutation(async ({ input }) => {
      caller.deleteLoginCode();
      const count = (
        db
          .prepare(
            "SELECT COUNT(username) as count FROM users WHERE username = ?;"
          )
          .get(input.username)! as any
      ).count;
      if (count === 0) {
        return false;
      } else {
        return true;
      }
    }),
  ringSchedule: publicProcedure
    .output(
      z.array(
        z.object({
          id: z.number(),
          fromDate: z.string(),
          toDate: z.string(),
          weekDay: z.string(),
          ringTime: z.string(),
        })
      )
    )
    .query(() => {
      caller.deleteLoginCode();
      return db.prepare("SELECT * FROM ringSchedule;").all() as any;
    }),
  addBellRule: publicProcedure
    .input(
      z.object({
        fromDate: z.string(),
        toDate: z.string(),
        weekDay: z.string(),
        ringTime: z.string(),
      })
    )
    .output(z.boolean())
    .mutation(({ input }) => {
      caller.deleteLoginCode();
      db.prepare(
        "INSERT INTO ringSchedule (id, fromDate, toDate, weekDay, ringTime) VALUES (?, ?, ?, ?, ?);"
      ).run(
        (
          db
            .prepare("SELECT MAX(id) AS latestRule FROM ringSchedule;")
            .get()! as any
        ).latestRule + 1,
        input.fromDate,
        input.toDate,
        input.weekDay,
        input.ringTime
      );
      return true;
    }),
  removeBellRuleById: publicProcedure
    .input(z.number())
    .mutation(({ input }) => {
      caller.deleteLoginCode();
      db.prepare("DELETE FROM ringSchedule WHERE id = ?;").run(input);
      return true;
    }),
  writeLoginCode: publicProcedure.mutation(() => {
    caller.deleteLoginCode();
    const loginCode = db.prepare("SELECT * FROM loginCode;").get()! as any;
    if (loginCode != undefined) {
      return false;
    }
    const date = new Date().toISOString();
    db.prepare("INSERT INTO loginCode (code, creationDate) VALUES (?,?);").run(
      Math.floor(100000 + Math.random() * 900000),
      date
    );
    return true;
  }),
  deleteLoginCode: publicProcedure
    .input(z.boolean().default(false))
    .output(z.boolean())
    .mutation(({ input }) => {
      const loginCode = db.prepare("SELECT * FROM loginCode;").get()! as any;
      if (loginCode == undefined) {
        return false;
      }
      var data = new Date(
        (db.prepare("SELECT * FROM loginCode;").get()! as any).creationDate
      );
      data.setMinutes(data.getMinutes() + 2);
      if (new Date() > data || input) {
        db.prepare("DELETE FROM loginCode;").run();
        return true;
      } else {
        return false;
      }
    }),
  compareCode: publicProcedure
    .input(z.string())
    .output(z.boolean())
    .mutation(({ input }) => {
      const loginCode = db.prepare("SELECT * FROM loginCode;").get()! as any;
      if (loginCode == undefined) {
        return false;
      }
      const code = (db.prepare("SELECT * FROM loginCode;").get()! as any)
        .code as number;
      if (input === code.toString()) {
        return true;
      } else {
        return false;
      }
    }),
  removeUser: publicProcedure.input(z.number()).mutation(({ input }) => {
    caller.deleteLoginCode();
    db.prepare("DELETE FROM users WHERE id = ?;").run(input);
    return true;
  }),
});
const caller = appRouter.createCaller({});

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    return {};
  },
});

const server = http.createServer((req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }
  handler(req, res);
});

server.listen(2022);
