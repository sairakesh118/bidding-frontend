"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

export function ToolConfigDialog({ tool, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh] p-6 overflow-hidden flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on outside click
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tool.icon}</span>
            <DialogTitle className="text-xl font-semibold">Configure {tool.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 -mx-2 px-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
} 