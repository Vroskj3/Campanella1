import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../Server/server";

export const trpc = createTRPCReact<AppRouter>();
