import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { Button } from "@chakra-ui/react";
import { IoMdSettings } from "react-icons/io";
import { Control } from "../Control";

export function Settings() {
  return (
    <SettingsDialog>
      <Control position="topright">
        <Button
          background="white"
          variant="outline"
          padding={0}
          borderWidth={2}
          borderColor="rgba(0,0,0,0.2)"
          color="rgba(0,0,0,0.5)"
          fontSize="1.5rem"
          borderRadius={5}
          size="lg"
        >
          <IoMdSettings />
        </Button>
      </Control>
    </SettingsDialog>
  );
}
