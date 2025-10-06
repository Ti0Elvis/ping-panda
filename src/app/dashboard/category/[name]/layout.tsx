import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { CategoryProvider } from "./context/category-context";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";

interface Props extends PropsWithChildren {
  params: Promise<{ name: string | string[] | undefined }>;
}

export default async function Layout({ params, children }: Readonly<Props>) {
  const { name } = await params;

  if (typeof name !== "string") {
    return notFound();
  }

  const auth = await currentUser();

  if (auth === null) {
    return notFound();
  }

  const user = await db.user.findUnique({
    where: { external_id: auth.id },
  });

  if (user === null) {
    return notFound();
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

  const hasEvents = category._count.events > 0;

  return (
    <section className="w-full h-screen flex flex-col">
      <DashboardHeader title={`${category.emoji} ${category.name} events`} />
      <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto">
        <CategoryProvider category={category} hasEvents={hasEvents}>
          {children}
        </CategoryProvider>
      </div>
    </section>
  );
}
