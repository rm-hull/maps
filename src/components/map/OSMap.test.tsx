import { describe, it, expect, vi } from "vitest";
import { act } from "@testing-library/react";
import * as GeneralSettingsHook from "../../hooks/useGeneralSettings";
import { render } from "../../test/utils";
import { OSMap } from "./OSMap";

describe("OSMap", () => {
  it("should render the map container", async () => {
    vi.spyOn(GeneralSettingsHook, "useGeneralSettings").mockReturnValue({
      settings: {
        mapStyle: "Open Street Map / OpenStreetMap",
        coordinateDisplay: "latlng-minutes",
      },
      updateSettings: vi.fn(),
      isLoading: false,
    });

    await act(async () => {
      render(<OSMap />);
    });
    const mapContainer = document.querySelector(".leaflet-container");
    expect(mapContainer).toBeInTheDocument();
    expect(document.querySelector(".coordinate-control")).toHaveTextContent("′");
  });

  it("uses decimal coordinates when selected in settings", async () => {
    vi.spyOn(GeneralSettingsHook, "useGeneralSettings").mockReturnValue({
      settings: {
        mapStyle: "Open Street Map / OpenStreetMap",
        coordinateDisplay: "latlng-decimal",
      },
      updateSettings: vi.fn(),
      isLoading: false,
    });

    await act(async () => {
      render(<OSMap />);
    });

    expect(document.querySelector(".coordinate-control")).toHaveTextContent(/\d+\.\d{5}° [NS]/);
  });

  it("shows eastings and northings when British National Grid is selected", async () => {
    vi.spyOn(GeneralSettingsHook, "useGeneralSettings").mockReturnValue({
      settings: {
        mapStyle: "Open Street Map / OpenStreetMap",
        coordinateDisplay: "bng",
      },
      updateSettings: vi.fn(),
      isLoading: false,
    });

    await act(async () => {
      render(<OSMap />);
    });

    expect(document.querySelector(".coordinate-control")).toHaveTextContent(/Easting: \d+Northing: \d+/);
  });

  it("does not render coordinates when the setting is none", async () => {
    vi.spyOn(GeneralSettingsHook, "useGeneralSettings").mockReturnValue({
      settings: {
        mapStyle: "Open Street Map / OpenStreetMap",
        coordinateDisplay: "none",
      },
      updateSettings: vi.fn(),
      isLoading: false,
    });

    await act(async () => {
      render(<OSMap />);
    });

    expect(document.querySelector(".coordinate-control")).not.toBeInTheDocument();
  });
});
