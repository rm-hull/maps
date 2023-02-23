/* eslint-disable @typescript-eslint/no-explicit-any */
import { camelCase } from "change-case";

const camelCaseKeys = (object: any) => {
  let newO: any, origKey, newKey, value;
  if (object instanceof Array) {
    return object.map((value) => {
      if (value !== null && typeof value === "object") {
        value = camelCaseKeys(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in object) {
      if (Object.prototype.hasOwnProperty.call(object, origKey)) {
        newKey = camelCase(origKey);
        value = object[origKey];
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = camelCaseKeys(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
};

export default camelCaseKeys;
