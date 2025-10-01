import { j } from "./jstack";
import { authRouter } from "./routers/auth-router";
import { eventCategoryRouter } from "./routers/event-category-router";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {
  auth: authRouter,
  eventCategory: eventCategoryRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
