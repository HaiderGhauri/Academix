import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { getCourse } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const resolvedParams = await searchParams;
  const { title, categoryId } = resolvedParams;

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourse({
    userId,
    title,
    categoryId,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <Suspense fallback={<div>Loading search input...</div>}>
          <SearchInput initialTitle={title}/>
        </Suspense>
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;

export const dynamic = "force-dynamic";
