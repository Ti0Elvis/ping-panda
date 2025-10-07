import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { CategoryProvider } from "./context/category";
import { CategoryContent } from "./components/category-content";
import { DashboardHeader } from "@/app/(root)/dashboard/components/dashboard-header";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function Page({ params }: Props) {
  const { name } = await params;

  if (typeof name !== "string") {
    return notFound();
  }

  const auth = await currentUser();

  if (auth === null) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: {
      external_id: auth.id,
    },
  });

  if (user === null) {
    return redirect("/callback");
  }

  const category = await db.eventCategory.findUnique({
    where: {
      name_user_id: {
        name: name,
        user_id: user.id,
      },
    },
    include: {
      _count: {
        select: {
          events: true,
        },
      },
    },
  });

  if (category === null) {
    return notFound();
  }

  const has_events = category._count.events > 0;

  return (
    <section className="w-full h-screen flex flex-col">
      <DashboardHeader title={`${category.emoji} ${category.name} events`} />
      <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto">
        <CategoryProvider category={category} has_events={has_events}>
          <CategoryContent />
        </CategoryProvider>
      </div>
    </section>
  );
}
