import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import http from "http";

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

let users = [
  {
    id: 1,
    username: "Alfio",
    password: "Alfio1",
    lastLogin: "",
  },
];

const appRouter = router({
  test: publicProcedure
    .output(
      z.object({
        id: z.number(),
        username: z.string(),
        password: z.string(),
        lastLogin: z.string(),
      })
    )
    .query(() => {
      return users[0];
    }),
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .output(z.boolean())
    .mutation((input) => {
      let success = false;
      users.forEach((i) => {
        if (i.username === input.input.username) {
          if (i.password == input.input.password) {
            i.lastLogin = new Date().toISOString();
            console.log(users);
            success = true;
            return;
          }
        }
      });
      return success;
    }),
  userByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .output(
      z
        .object({
          id: z.number(),
          username: z.string(),
          password: z.string(),
          lastLogin: z.string(),
        })
        .optional()
    )
    .query((input) => {
      return users.find((i) => i.username === input.input.username);
    }),
});

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    console.log("context 3");
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
