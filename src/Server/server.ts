import { initTRPC } from "@trpc/server";
import { z } from "zod";
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
  test: publicProcedure
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
      return db.prepare("SELECT * FROM users;").all();
    }),
  emptyDatabase: publicProcedure
    .input(z.enum(["users", "ringSchedule"]))
    .mutation(({ input }) => {
      console.log(input);
      if (input === "users") db.prepare("DELETE FROM users;").run();
      else if (input === "ringSchedule")
        db.prepare("DELETE FROM ringSchedule;").run();
    }),
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .output(z.boolean())
    .mutation(async ({ input }) => {
      let success = false;
      let dbPassword = db
        .prepare("SELECT password FROM users WHERE username = ?;")
        .get(input.username);
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
      bcrypt.hash(input.password, saltRounds, function (err, hash) {
        db.prepare(
          "INSERT INTO users (id, username, password, lastLogin) VALUES (?, ?, ?, ?);"
        ).run(
          db.prepare("SELECT MAX(id) AS latestUser FROM users;").get()
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
      const count = db
        .prepare(
          "SELECT COUNT(username) as count FROM users WHERE username = ?;"
        )
        .get(input.username).count;
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
      return db.prepare("SELECT * FROM ringSchedule").all();
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
      db.prepare(
        "INSERT INTO ringSchedule (id, fromDate, toDate, weekDay, ringTime) VALUES (?, ?, ?, ?, ?);"
      ).run(
        db.prepare("SELECT MAX(id) AS latestRule FROM ringSchedule;").get()
          .latestRule + 1,
        input.fromDate,
        input.toDate,
        input.weekDay,
        input.ringTime
      );
      return true;
    }),
});

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
