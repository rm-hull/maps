import userEvent from "@testing-library/user-event";
import * as GeneralSettingsHook from "../../hooks/useGeneralSettings";
import { render, screen, waitFor } from "../../test/utils";
import { SettingsForm } from "./SettingsForm";

const updateSettings = vi.fn(async () => {});

describe("SettingsForm coordinate display", () => {
  beforeEach(() => {
    updateSettings.mockClear();
    vi.spyOn(GeneralSettingsHook, "useGeneralSettings").mockReturnValue({
      settings: { mapStyle: "Leisure" },
      updateSettings,
      isLoading: false,
    });
  });

  it("shows the coordinate display choices vertically with minutes selected by default", () => {
    render(<SettingsForm />);

    expect(screen.getByRole("radio", { name: "None" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Lat/Lng (decimal)" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Lat/Lng (minutes)" })).toBeChecked();
  });

  it("saves the selected coordinate display setting", async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.click(screen.getByRole("radio", { name: "Lat/Lng (decimal)" }));

    await waitFor(() =>
      expect(updateSettings).toHaveBeenCalledWith({ mapStyle: "Leisure", coordinateDisplay: "decimal" })
    );
  });
});