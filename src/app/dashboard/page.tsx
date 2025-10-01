import { DashboardHeader } from "./components/dashboard-header";
import { DashboardContent } from "./components/dashboard-content";
import { CreateCategoryDialog } from "./components/create-category-dialog";

export default function Page() {
  return (
    <section className="w-full h-screen flex flex-col">
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto">
        <CreateCategoryDialog />
        <DashboardContent />
      </div>
    </section>
  );
}
