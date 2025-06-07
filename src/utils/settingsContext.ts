import { createContext } from "react";

export interface SettingsContextProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);
