export const SALON_TIME_ZONE =
  import.meta.env.VITE_SALON_TIME_ZONE || "America/New_York";

export const SALON_TIME_ZONE_LABEL = "Eastern Time (Baltimore)";

export const getSalonTimeZoneLabel = (
  timeZone: string = SALON_TIME_ZONE
): string =>
  timeZone === "America/New_York" ? SALON_TIME_ZONE_LABEL : timeZone;

export const getSalonDate = (value: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SALON_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value;

  return `${part("year")}-${part("month")}-${part("day")}`;
};
