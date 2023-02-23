import camelCaseData from "./test-data/camel_case.json";
import snakeCaseData from "./test-data/snake_case.json";

import camelCaseKeys from "./camelCaseKeys";

it("should format object keys to be camelCase", () => {
  expect(camelCaseKeys(snakeCaseData)).toEqual(camelCaseData);
});
