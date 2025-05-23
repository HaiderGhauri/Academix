import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { columns } from "./_components/colums";
import { DataTable } from "./_components/data-table";


const CoursesPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/")
    }

    const courses = await db.course.findMany({
        where: {
            userId
        }, 
        orderBy: {
            createdAt: "desc"
        }
    })

    return ( 
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
     );
}
 
export default CoursesPage;