import { db } from "@/lib/db";
import { jstack } from "jstack";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

const authMiddleware = j.middleware(async ({ c, next }) => {
  const header = c.req.header("Authorization");

  if (header !== undefined) {
    const api_key = header.split(" ")[1];

    const user = await db.user.findUnique({
      where: { api_key },
    });

    if (user !== null) return next({ user });
  }

  const auth = await currentUser();

  if (auth === null) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const user = await db.user.findUnique({
    where: { external_id: auth.id },
  });

  if (user === null) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return next({ user });
});

export const publicProcedure = j.procedure;
export const privateProcedure = publicProcedure.use(authMiddleware);
