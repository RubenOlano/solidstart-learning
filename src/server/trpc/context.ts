import type { inferAsyncReturnType } from "@trpc/server";
import type { createSolidAPIHandlerContext } from "solid-start-trpc";
import { prisma } from "~/server/db/client";
import { getSession } from "@auth/solid-start";
import { authOpts } from "~/routes/api/auth/[...solidauth]";
import type { Session } from "@auth/core/types";

type ContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: ContextOptions) => {
  return {
    prisma,
    session: opts.session,
  };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  const { req } = opts;
  const session = await getSession(req, authOpts);

  console.log({ from_create_context: session });
  return await createContextInner({ session });
};

export type IContext = inferAsyncReturnType<typeof createContextInner>;
