import { describe, it, expect, vi } from "vitest";
import { render } from "../../test/utils";
import { OSMap } from "./OSMap";
import * as GeneralSettingsHook from "../../hooks/useGeneralSettings";

describe("OSMap", () => {
  it("should render the map container", () => {
    vi.spyOn(GeneralSettingsHook, "useGeneralSettings").mockReturnValue({
      settings: {},
      updateSettings: vi.fn(),
      isLoading: false,
    });

    render(<OSMap />);
    const mapContainer = document.querySelector(".leaflet-container");
    expect(mapContainer).toBeInTheDocument();
  });
});
