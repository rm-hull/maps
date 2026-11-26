import LZString from "lz-string";
import { describe, expect, it } from "vitest";
import { decodeState } from "./share";

function encodePayload(payload: object): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
}

describe("decodeState", () => {
  it("decodes valid map state", () => {
    const state = { center: [51.5, -0.1], zoom: 13, settings: { mapStyle: "Roads" } };

    expect(decodeState(encodePayload(state))).toEqual(state);
  });

  it.each([
    { center: [], zoom: 13 },
    { center: [51.5], zoom: 13 },
    { center: ["51.5", -0.1], zoom: 13 },
    { center: [51.5, null], zoom: 13 },
    { center: [51.5, -0.1], zoom: "13" },
    { center: [51.5, -0.1], zoom: null },
  ])("rejects malformed state: %j", (state) => {
    expect(decodeState(encodePayload(state))).toBeNull();
  });

  it.each(['{"center":[1e10000,0],"zoom":13}', '{"center":[0,0],"zoom":1e10000}'])(
    "rejects non-finite map coordinates or zoom",
    (json) => {
      expect(decodeState(LZString.compressToEncodedURIComponent(json))).toBeNull();
    }
  );
});
