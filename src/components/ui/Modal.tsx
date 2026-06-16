"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const sizeClass: Record<string, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[500px]",
  lg: "max-w-[640px]",
  xl: "max-w-[800px]",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: keyof typeof sizeClass;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, size = "md", children, className }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] rounded-lg bg-card text-card-foreground shadow-e3 border border-border",
                  sizeClass[size],
                  className,
                )}
              >
                {children}
                <Dialog.Close
                  className="absolute right-4 top-4 rounded-md text-muted-foreground hover:text-foreground focus-ring p-1"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export function ModalHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-border", className)}>
      <Dialog.Title className="text-h2 text-foreground">{title}</Dialog.Title>
      {description && (
        <Dialog.Description className="text-small text-muted-foreground mt-1">
          {description}
        </Dialog.Description>
      )}
    </div>
  );
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/40 rounded-b-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
