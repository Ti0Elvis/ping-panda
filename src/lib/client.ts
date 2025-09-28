import { createClient } from "jstack";
import type { AppRouter } from "@/server";

export const client = createClient<AppRouter>({
  baseUrl: "http://localhost:3000/api",
});
