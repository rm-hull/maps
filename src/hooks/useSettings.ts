import { useContext } from "react";
import { type SettingsContextProps, SettingsContext } from "../components/settings/SettingsProvider";

export function useSettings(): SettingsContextProps {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings() must be used within a SettingsProvider");
  }

  return context;
}
