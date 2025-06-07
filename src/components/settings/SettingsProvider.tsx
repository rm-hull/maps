import { useDisclosure } from "@chakra-ui/react";
import { type PropsWithChildren, type ReactNode } from "react";
import { SettingsContext } from "../../utils/settingsContext";

export default function SettingsProvider({ children }: PropsWithChildren<unknown>): ReactNode {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return <SettingsContext.Provider value={{ isOpen, onOpen, onClose }}>{children}</SettingsContext.Provider>;
}
