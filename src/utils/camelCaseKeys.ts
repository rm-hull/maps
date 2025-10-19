import { camelCase } from "change-case";

type PlainObject = Record<string, unknown>;

export function camelCaseKeys<T extends PlainObject>(input: T): T;
export function camelCaseKeys<T extends unknown[]>(input: T): T;
export function camelCaseKeys(input: unknown): unknown;
export function camelCaseKeys(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => camelCaseKeys(item as unknown));
  }

  if (input && typeof input === "object") {
    return Object.fromEntries(Object.entries(input).map(([key, value]) => [camelCase(key), camelCaseKeys(value)]));
  }

  return input;
}
