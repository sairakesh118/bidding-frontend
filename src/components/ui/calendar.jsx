import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Calendar = ({ className, classNames, showOutsideDays = true, onSelect,dayRange = 60,...props }) => {

  // Calculate the date 60 days from today
  const today = new Date();
  const sixtyDaysFromNow = new Date(today);
  sixtyDaysFromNow.setDate(today.getDate() + dayRange);

  // Disable dates outside the 60-day range
  const disabledDays = [
    {
      before: today,
      after: sixtyDaysFromNow
    }
  ];
  return (
    <DayPicker
    onSelect={onSelect}
      showOutsideDays={showOutsideDays}
      className={`flex flex-col items-center justify-center ${className}`} // Increased padding
      classNames={{
        months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0", // Increased spacing
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-lg font-semibold", // Larger text
        nav: "space-x-2 flex items-center",
        nav_button: "h-10 w-10 bg-transparent p-1 opacity-70 hover:opacity-100 border rounded-lg", // Larger buttons
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-11 font-medium text-base", // Larger text
        row: "flex w-full mt-2",
        cell: "text-center text-base p-1 relative", // Larger text
        day: "h-10 w-9 p-1 font-medium text-gray-900 hover:bg-gray-200 rounded-lg", // Larger day buttons
        day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
        day_today: "bg-black text-white font-semibold",
        day_outside: "text-gray-400 opacity-60",
        day_disabled: "text-gray-400 opacity-50",
        day_range_middle: "bg-blue-100 text-blue-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      disabled={disabledDays}
      fixedWeeks={true}
      modifiers={{
        disabled: disabledDays
      }}

      components={{
        IconLeft: () => <ChevronLeft className="h-6 w-6" />, // Larger icons
        IconRight: () => <ChevronRight className="h-6 w-6" />,
      }}
      {...props}
    />
  );
};

Calendar.displayName = "Calendar";

export { Calendar };
