import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress } from "@prisma/client";

import { 
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
 } from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const CourseMobileSidebar = ({
    course,
    progressCount
}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent className="p-0 bg-white w-72" side="left">
                <SheetTitle className="sr-only hidden">Mobile sidebar</SheetTitle>
                <CourseSidebar 
                    course={course}
                    progressCount={progressCount}
                />
            </SheetContent>
        </Sheet>
    )
}