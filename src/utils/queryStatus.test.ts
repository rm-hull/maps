import { fromReactQuery } from "./queryStatus";

describe("queryStatus", () => {
  describe("fromReactQuery", () => {
    it("should convert error status to error state", () => {
      expect(fromReactQuery("error")).toBe("error");
    });

    it("should convert loading status to busy state", () => {
      expect(fromReactQuery("pending")).toBe("busy");
    });

    it("should convert success status to ok state", () => {
      expect(fromReactQuery("success")).toBe("ok");
    });
  });
});
