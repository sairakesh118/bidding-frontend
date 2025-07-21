import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.round((date - new Date()) / (1000 * 60 * 60 * 24)),
    'day'
  );
};


