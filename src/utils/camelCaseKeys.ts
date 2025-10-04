import { camelCase } from "change-case";

type PlainObject = Record<string, unknown>;

export function camelCaseKeys<T extends PlainObject | unknown[]>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) =>
      typeof item === "object" && item !== null ? camelCaseKeys(item as PlainObject) : item
    ) as T;
  }
  const result: PlainObject = {};
  Object.entries(input).forEach(([key, value]) => {
    const newKey = camelCase(key);
    result[newKey] =
      Array.isArray(value) || (value && typeof value === "object") ? camelCaseKeys(value as PlainObject) : value;
  });
  return result as T;
}
