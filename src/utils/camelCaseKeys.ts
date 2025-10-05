import { camelCase } from "change-case";
export function camelCaseKeys<T extends PlainObject>(input: T): T;
export function camelCaseKeys<T extends unknown[]>(input: T): T;
export function camelCaseKeys(input: unknown): unknown;
export function camelCaseKeys(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => camelCaseKeys(item));
  }

  if (input && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input as Record<string, unknown>).map(([key, value]) => [
        camelCase(key),
        camelCaseKeys(value),
      ])
    );
  }

  return input;
}
