import { useDisclosure } from "@chakra-ui/react";
import { createContext, type PropsWithChildren, type ReactNode } from "react";

export interface SettingsContextProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export function SettingsProvider({ children }: PropsWithChildren<unknown>): ReactNode {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return <SettingsContext.Provider value={{ isOpen, onOpen, onClose }}>{children}</SettingsContext.Provider>;
}
