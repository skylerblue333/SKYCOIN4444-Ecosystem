import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures, but a supplied session
    // that fails authentication is operationally meaningful and should be
    // visible in runtime evidence without logging the cookie value itself.
    if (opts.req.headers.cookie?.includes(`${COOKIE_NAME}=`)) {
      console.warn(
        "[Auth] Supplied session authentication failed:",
        error instanceof Error ? error.message : String(error)
      );
    }
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
