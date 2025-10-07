import { createClient } from "jstack";
import { BASE_URL } from "./constants";
import type { AppRouter } from "@/server";

export const client = createClient<AppRouter>({
  baseUrl: `${BASE_URL}/api`,
});
