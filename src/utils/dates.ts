const iso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export function dateReviver(_key: string, value: unknown) {
  return typeof value === "string" && iso8601.test(value) ? new Date(value) : value;
}

export function formatDate(date?: Date | string): string | undefined {
  if (date === undefined) {
    return undefined;
  }
  const d = date instanceof Date ? date : new Date(date);
  const isMidnight = d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0;

  const options: Intl.DateTimeFormatOptions = isMidnight
    ? { dateStyle: "medium" } // Just the date
    : { dateStyle: "medium", timeStyle: "short" }; // Date + time

  return new Intl.DateTimeFormat(undefined, options).format(d);
}
