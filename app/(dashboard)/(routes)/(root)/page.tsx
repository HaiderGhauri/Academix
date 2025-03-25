import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server"
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, courseInProgress } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard 
          icon={Clock}
          label="In progress"
          numerOfItems={courseInProgress.length}
        />
        <InfoCard 
          icon={CheckCircle}
          label="Completed"
          numerOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      <CoursesList 
        items={[...courseInProgress, ...completedCourses]}
      /> 
    </div>
  )
}
