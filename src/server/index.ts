import { j } from "./jstack";
import { auth_router } from "./routers/auth";
import { payment_router } from "./routers/payment";
import { project_router } from "./routers/project";
import { event_category_router } from "./routers/event-category";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {
  auth: auth_router,
  event_category: event_category_router,
  payment: payment_router,
  project: project_router,
});

export type AppRouter = typeof appRouter;

export default appRouter;
