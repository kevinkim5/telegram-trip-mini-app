import { differenceInDays, format, parseISO, isAfter } from "date-fns";

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "MMM d, yyyy h:mm a");
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "h:mm a");
  } catch {
    return dateString;
  }
};

export const getDaysUntil = (dateString: string): number => {
  const date = parseISO(dateString);
  const now = new Date();
  return differenceInDays(date, now);
};

export const getDaysRemaining = (
  startDate: string,
  endDate: string
): number => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return differenceInDays(end, start) + 1;
};

export const getCountdownText = (daysUntil: number): string => {
  if (daysUntil === 0) return "Today!";
  if (daysUntil === 1) return "Tomorrow!";
  if (daysUntil < 0) return "Trip ended";
  return `${daysUntil} days`;
};

export const isUpcoming = (endDate: string): boolean => {
  return isAfter(parseISO(endDate), new Date());
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
