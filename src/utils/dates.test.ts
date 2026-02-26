import { dateReviver, formatDate } from "./dates";

describe("dateReviver", () => {
  it("should return a Date object for a valid ISO 8601 string", () => {
    const dateString = "2025-10-22T10:00:00Z";
    const expectedDate = new Date(dateString);
    expect(dateReviver("key", dateString)).toEqual(expectedDate);
  });

  it("should return the original value for a non-ISO 8601 string", () => {
    const value = "not a date";
    expect(dateReviver("key", value)).toBe(value);
  });

  it("should return the original value for a non-string value", () => {
    const value = 123;
    expect(dateReviver("key", value)).toBe(value);
  });
});

describe("formatDate", () => {
  it("should return undefined for an undefined date", () => {
    expect(formatDate(undefined)).toBeUndefined();
  });

  it("should format a Date object with a time other than midnight", () => {
    const date = new Date("2025-10-22T10:00:00Z");
    const expected = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
    expect(formatDate(date)).toBe(expected);
  });

  it("should format a string date with a time other than midnight", () => {
    const dateString = "2025-10-22T10:00:00Z";
    const date = new Date(dateString);
    const expected = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
    expect(formatDate(dateString)).toBe(expected);
  });

  it("should format a Date object at midnight as just the date", () => {
    const date = new Date("2025-10-22T00:00:00Z");
    const expected = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
    expect(formatDate(date)).toBe(expected);
  });

  it("should format a string date at midnight as just the date", () => {
    const dateString = "2025-10-22T00:00:00Z";
    const date = new Date(dateString);
    const expected = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
    expect(formatDate(dateString)).toBe(expected);
  });
});
