"use client";

// import axios from "axios";
// import MuxPlayer from "@mux/mux-player-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Loader2, Lock } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { useConfettiStore } from "@/hooks/use-confetti-store";

// interface VideoPlayerProps {
//     playbackId: string;
//     courseId: string;
//     chapterId: string;
//     nextChapterId?: string;
//     isLocked: boolean;
//     completeOnEnd: boolean;
//     title: string;
// }

// export const VideoPlayer = ({
//     playbackId,
//     courseId,
//     chapterId,
//     nextChapterId,
//     isLocked,
//     completeOnEnd,
//     title
// }: VideoPlayerProps) => {
//     const [isReady, setIsReady] = useState(true);
//     const router = useRouter();
//     const confetti = useConfettiStore();

//     const onEnd = async () => {
//         try {
//             if (completeOnEnd) {
//                 await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
//                     isCompleted: true,
//                 });
//             }

//             if (!nextChapterId) {
//                 confetti.onOpen();
//             }

//             toast.success("Progress updated");
//             router.refresh();

//             if (nextChapterId) {
//                 router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
//             }

//         } catch {
//             toast.error("Something went wrong");
//         }
//     }

//     return (
//         <div className="relative aspect-video">
//             {!isReady && !isLocked && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
//                     <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
//                 </div>
//             )}

//             {isLocked && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
//                 <Lock className="h-8 w-8"/>
//                 <p className="text-sm">
//                     This chapter is locked
//                 </p>
//             </div>
//             )}

//             {!isLocked && (
//                 <video src={playbackId} controls className="w-full" />
//                 // <MuxPlayer
//                 //     title={title}
//                 //     className={cn(
//                 //         !isReady && "hidden"
//                 //     )}
//                 //     onCanPlay={() => setIsReady(true)}
//                 //     onEnded={onEnd}
//                 //     autoPlay
//                 //     playbackId={playbackId}
//                 // />
//             )}
//         </div>
//     )
// }

"use client";

import axios from "axios";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

// import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  purchase?: boolean;
}

export const VideoPlayer = ({
  videoUrl,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  purchase,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    if (!purchase) {
      return;
    }
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
      }

      if (!nextChapterId) {
        confetti.onOpen();
        toast.success("Course completed!");
      } else {
        toast.success("Progress updated");
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}

      {!isLocked && (
        <Suspense fallback={null}>
          <ReactPlayer
            url={videoUrl}
            title={title}
            controls
            width="100%"
            height="100%"
            playing={true}
            onReady={() => setIsReady(true)}
            onEnded={onEnd}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload nopictureinpicture",
                },
              },
            }}
          />
        </Suspense>
      )}
    </div>
  );
};
