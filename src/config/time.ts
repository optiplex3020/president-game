export const DEFAULT_START_DATE = new Date('2024-05-01T09:00:00');

export const DAYS_PER_MANDATE = 1826; // 5 years including leap days
export const MAX_MANDATES = 2;

export const ONE_HOUR_MS = 60 * 60 * 1000;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;

export const daysBetween = (later: Date, earlier: Date): number => {
  return Math.floor((later.getTime() - earlier.getTime()) / ONE_DAY_MS);
};

export const clampDayInMandate = (startDate: Date, currentDate: Date): number => {
  return Math.max(1, daysBetween(currentDate, startDate) + 1);
};
