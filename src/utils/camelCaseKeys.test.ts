import { expect, it } from "vitest";
import camelCaseData from "./test-data/camel_case.json";
import { camelCaseKeys } from "./camelCaseKeys";
import snakeCaseData from "./test-data/snake_case.json";

it("should format object keys to be camelCase", () => {
  expect(camelCaseKeys(snakeCaseData)).toEqual(camelCaseData);
});
