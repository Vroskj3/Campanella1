import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

const users = [
  {
    id: 1,
    username: "Alfio",
    password: "Alfio1",
  },
];

//login mutation
const appRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .query((input) => {
      let user = users.find((i) => i.username === input.input.username);
      if (user != null) {
        if (user.password == input.input.password) {
          return true;
        } else {
          return false;
        }
      } else {
        return undefined;
      }
    }),
  userByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query((input) => {
      return users.find((i) => i.username === input.input.username);
    }),
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(2022);
