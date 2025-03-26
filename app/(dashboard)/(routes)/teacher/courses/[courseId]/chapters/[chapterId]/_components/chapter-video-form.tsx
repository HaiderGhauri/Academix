"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";


interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Sending PATCH:", { courseId, chapterId, values });
      const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      router.refresh();
      console.log("CHAPTER_VIDEO_RESPONSE:", response.data);
      toast.success("Chapter updated");
      toggleEdit();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Patch error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack,
      });
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )} 

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4" />
              Add Video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&  (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
           <ReactPlayer 
            src={initialData.videoUrl} 
            controlsList="nodownload" 
            width="100%"
            height="100%" 
            playing={false}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload nopictureinpicture",
                },
              },
              }}
           />
          </div>
        )
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              console.log("Uploaded Video URL:", url);
              if (url) {
                onSubmit({videoUrl: url})
              }
            }}
          />

          <div className="text-sm text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Video can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  );
};
