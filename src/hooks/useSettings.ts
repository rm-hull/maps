import { useContext } from "react";
import { SettingsContext, type SettingsContextProps } from "../utils/settingsContext";

export function useSettings(): SettingsContextProps {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings() must be used within a SettingsProvider");
  }

  return context;
}
