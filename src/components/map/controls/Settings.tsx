import { Button } from "@chakra-ui/react";
import { IoMdSettings } from "react-icons/io";
import Control from "react-leaflet-custom-control";
import { useSettings } from "../../../hooks/useSettings";

export function Settings() {
  const { onOpen } = useSettings();

  return (
    <Control position="topright">
      <Button
        background="white"
        variant="outline"
        onClick={onOpen}
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
  );
}
