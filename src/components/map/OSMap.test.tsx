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
      },
      updateSettings: vi.fn(),
      isLoading: false,
    });

    await act(async () => {
      render(<OSMap />);
    });
    const mapContainer = document.querySelector(".leaflet-container");
    expect(mapContainer).toBeInTheDocument();
  });
});
