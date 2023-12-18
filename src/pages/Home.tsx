import { type JSX } from "react";
import OSMap from "../components/map/OSMap";
import SettingsModal from "../components/settings/SettingsModal";
import useSettings from "../hooks/useSettings";

export default function Home(): JSX.Element {
  const { isOpen, onClose } = useSettings();
  return (
    <>
      <OSMap />
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
