import { db } from "@/lib/db";
import { jstack } from "jstack";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

const auth_middleware = j.middleware(async ({ c, next }) => {
  const auth_header = c.req.header("Authorization");

  if (auth_header !== undefined) {
    const api_key = auth_header.split(" ")[1];

    const user = await db.user.findUnique({
      where: { api_key },
    });

    if (user !== null) {
      return next({ user });
    }
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

export const public_procedure = j.procedure;
export const private_procedure = public_procedure.use(auth_middleware);
