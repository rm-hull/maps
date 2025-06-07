import { SettingsContext, type SettingsContextProps } from "../utils/settingsContext";
import { useContext } from "react";

export function useSettings(): SettingsContextProps {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings() must be used within a SettingsProvider");
  }

  return context;
}
