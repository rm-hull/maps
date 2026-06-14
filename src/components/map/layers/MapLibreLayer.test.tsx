import type { Map as MaplibreMap } from "maplibre-gl";
import { describe, it, expect, vi } from "vitest";
import { buildOpacitySnapshot, applyOpacity } from "./MapLibreLayer";

describe("MapLibreLayer internal functions", () => {
  it("buildOpacitySnapshot should capture current opacities (numbers and expressions)", () => {
    const mockMap = {
      getStyle: vi.fn().mockReturnValue({
        layers: [
          { id: "layer1", type: "fill" },
          { id: "layer2", type: "line" },
          { id: "layer3", type: "circle" },
          { id: "layer4", type: "heatmap" },
        ],
      }),
      getPaintProperty: vi.fn((layerId, prop) => {
        if (layerId === "layer1" && prop === "fill-opacity") return 0.8;
        if (layerId === "layer2" && prop === "line-opacity") return ["interpolate", ["zoom"], 0, 0, 10, 1];
        if (layerId === "layer4" && prop === "heatmap-opacity") return 0.6;
        return undefined;
      }),
    } as unknown as MaplibreMap;

    const snapshot = buildOpacitySnapshot(mockMap);

    expect(snapshot.get("layer1")).toEqual({ "fill-opacity": 0.8 });
    expect(snapshot.get("layer2")).toEqual({ "line-opacity": ["interpolate", ["zoom"], 0, 0, 10, 1] });
    expect(snapshot.get("layer3")).toEqual({ "circle-opacity": 1 }); // default
    expect(snapshot.get("layer4")).toEqual({ "heatmap-opacity": 0.6 }); // verifies typo fix
  });

  it("applyOpacity should apply scaled opacities as expressions", () => {
    const mockMap = {
      setPaintProperty: vi.fn(),
      getLayer: vi.fn().mockReturnValue({}),
    } as unknown as MaplibreMap;

    const snapshot = new Map([
      ["layer1", { "fill-opacity": 0.8 }],
      ["layer2", { "line-opacity": ["interpolate", ["zoom"], 0, 0, 10, 1] }],
    ]);

    applyOpacity(mockMap, 0.5, snapshot);

    expect(mockMap.setPaintProperty).toHaveBeenCalledWith("layer1", "fill-opacity", 0.4);
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith("layer2", "line-opacity", [
      "*",
      ["interpolate", ["zoom"], 0, 0, 10, 1],
      0.5,
    ]);
  });

  it("applyOpacity should restore original values when opacity is 1", () => {
    const mockMap = {
      setPaintProperty: vi.fn(),
      getLayer: vi.fn().mockReturnValue({}),
    } as unknown as MaplibreMap;

    const snapshot = new Map([["layer1", { "fill-opacity": 0.8 }]]);

    applyOpacity(mockMap, 1, snapshot);

    expect(mockMap.setPaintProperty).toHaveBeenCalledWith("layer1", "fill-opacity", 0.8);
  });
});
