"use client";

import { Sparkles } from "lucide-react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface AIInsightModalProps {
  open: boolean;
  onClose: () => void;
}

export function AIInsightModal({ open, onClose }: AIInsightModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} size="md">
      <ModalHeader
        title="AI Insights — coming soon"
        description="Squalto AI is in active development."
      />
      <ModalBody className="flex flex-col items-center text-center py-6">
        <div className="w-16 h-16 rounded-full bg-ai-gradient flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <p className="text-small text-muted-foreground max-w-sm">
          Smart send-time recommendations, subject-line tips, and conversation analysis
          are launching soon. We&apos;ll let you know when AI Insights goes live.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}
