import confetti from "canvas-confetti";
import { create } from "zustand";

type ConfettiStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useConfettiStore = create<ConfettiStore>((set) => ({
    isOpen: false,
    onOpen: () => {
        set({ isOpen: true });
        confetti({             
            particleCount: 500,
            spread: 360,
            angle: 90,
            startVelocity: 60,
            gravity: 0.8,
            zIndex: 1000,
          origin: { x: 0.5, y: 0.5 },
        });
      },
    onClose: () => set({ isOpen: false }),
}));