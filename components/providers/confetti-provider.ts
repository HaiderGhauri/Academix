"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
  const { isOpen } = useConfettiStore();
  if(!isOpen) return null
};
