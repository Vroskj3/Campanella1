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
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .output(z.boolean())
    .mutation(async ({ input }) => {
      let success = false;
      let dbPassword = db
        .prepare("SELECT password FROM users WHERE username = ?;")
        .get(input.username);
      success = await bcrypt.compare(input.password, dbPassword.password);
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
