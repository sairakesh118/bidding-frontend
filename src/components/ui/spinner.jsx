import { Loader2 } from "lucide-react";

export function Spinner({ className, ...props }) {
  return (
    <div className="flex justify-center p-4" {...props}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
} 