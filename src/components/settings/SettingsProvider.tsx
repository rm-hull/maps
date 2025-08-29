import { useDisclosure } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";
import { SettingsContext } from "../../utils/settingsContext";

export default function SettingsProvider({ children }: PropsWithChildren<unknown>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return <SettingsContext.Provider value={{ isOpen, onOpen, onClose }}>{children}</SettingsContext.Provider>;
}
