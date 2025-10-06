import { j } from "./jstack";
import { authRouter } from "./routers/auth-router";
import { paymentRouter } from "./routers/payment-router";
import { projectRouter } from "./routers/project-router";
import { categoryRouter } from "./routers/category-router";

const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(api, {
  auth: authRouter,
  category: categoryRouter,
  payment: paymentRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
