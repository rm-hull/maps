import { IoMdSettings } from "react-icons/io";
import { ControlButton } from "@/components/ControlButton";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { Control } from "../Control";

export function Settings() {
  return (
    <SettingsDialog>
      <Control position="topright">
        <ControlButton>
          <IoMdSettings />
        </ControlButton>
      </Control>
    </SettingsDialog>
  );
}
