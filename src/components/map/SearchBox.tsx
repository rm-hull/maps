import { greenMarker } from "@/icons";
import { Collapsible, Input, InputGroup, useControllableState, useDisclosure } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import { type ChangeEvent, useEffect, useState } from "react";
import { Marker, Popup, useMapEvent } from "react-leaflet";
import { useKeyPressEvent } from "react-use";
import { useFocus } from "../../hooks/useFocus";
import { find } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";
import { type SearchState, StateIcon } from "../StateIcon";
import { useColorModeValue } from "../ui/color-mode";
import { Control } from "./Control";
import { NearestInfo } from "./NearestInfo";

export function SearchBox() {
  const { open, onOpen, onClose } = useDisclosure();
  const [inputRef, setInputFocus] = useFocus();
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [value, setValue] = useControllableState({ defaultValue: "" });
  const [searching, setSearching] = useState<SearchState>();
  const [position, setPosition] = useState<LatLng | undefined>();
  const map = useMapEvent("moveend", () => {
    if (searching === "busy") {
      setSearching("ok");
    }
  });

  useEffect(() => {
    if (open) {
      setTimeout(setInputFocus, 20);
    }
  }, [open, setInputFocus]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearching(undefined);
    setValue(e.target.value);
  };

  const handleCancel = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    setValue("");
    setSearching(undefined);
    setPosition(undefined);
    onClose();
  };

  const handleSearch = async (): Promise<void> => {
    try {
      setSearching("busy");
      const data = await find(value, 1);
      if (data.header.totalresults === 0) {
        setSearching("not-found");
        return;
      }

      const { geometryX, geometryY } = data.results[0].gazetteerEntry;
      const latlng = toLatLng([geometryX, geometryY]);
      setPosition(latlng);
      map.flyTo(latlng, map.getZoom());
    } catch (e) {
      setSearching("error");
      console.error(e);
    }
  };

  useKeyPressEvent("/", onOpen);
  useKeyPressEvent("Enter", () => {
    handleSearch().catch(console.error);
  });
  useKeyPressEvent("Escape", handleCancel);

  return (
    <Control position="bottomright" prepend>
      <Collapsible.Root open={open}>
        <Collapsible.Content p="4px">
          <InputGroup startElement={<StateIcon state={searching} />} startElementProps={{ pointerEvents: "none" }}>
            <Input
              id="search"
              name="search"
              borderWidth={2}
              borderColor="rgba(0,0,0,0.2)"
              // focusBorderColor="rgba(0,0,0,0.2)"
              readOnly={searching === "busy"}
              autoComplete="off"
              autoCapitalize="off"
              width={500}
              ref={inputRef}
              placeholder="Input place (town, postcode, …) to search, then press ‹enter›"
              bgColor={bg}
              value={value}
              onChange={handleChange}
            />
          </InputGroup>
          {position && (
            <Marker position={position} icon={greenMarker}>
              <NearestInfo
                latLng={position}
                render={(children) => (
                  <Popup position={position} autoClose={false} closeButton={false}>
                    {children}
                  </Popup>
                )}
              />
            </Marker>
          )}
        </Collapsible.Content>
      </Collapsible.Root>
    </Control>
  );
}
