import { format, isValid, parseISO } from "date-fns";

export function normalizeApiDate(value: string): string {
  if (!value) {
    return value;
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);

  if (match) {
    return match[1];
  }

  const parsed = parseApiDate(trimmed);
  return parsed ? format(parsed, "yyyy-MM-dd") : value;
}

export function parseApiDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  const normalized = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (normalized) {
    const [year, month, day] = normalized[1].split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return isValid(date) ? date : null;
  }

  const isoDate = parseISO(trimmed);
  if (isValid(isoDate)) {
    return isoDate;
  }

  const fallbackDate = new Date(trimmed);
  return isValid(fallbackDate) ? fallbackDate : null;
}

export function formatApiDate(value: string, pattern: string): string {
  const parsed = parseApiDate(value);
  return parsed ? format(parsed, pattern) : value;
}
