import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    variant?: "default" | "success",
    icon: LucideIcon,
    label: string,
    numerOfItems: number,
};

export const InfoCard = ({
    variant,
    icon: Icon,
    label,
    numerOfItems,  
}: InfoCardProps) => {
    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge 
                variant={variant}
                icon={Icon}
            />
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-gray-500 text-sm">
                    {numerOfItems} {numerOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    )
}