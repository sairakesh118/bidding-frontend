import React from "react";
import { cn } from "@/lib/utils"; // Utility for merging class names

const Input = React.forwardRef(({ className, type, icon: Icon, iconClassName, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {/* Render Icon only if provided */}
      {Icon && (
        <Icon className={cn("absolute left-3 text-gray-500 w-5 h-5", iconClassName)} />
      )}

      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          Icon ? "pl-10" : "pl-3", // Add left padding ONLY if an icon exists
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export { Input };
