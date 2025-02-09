import {
  Box,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useControllableState,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, type ChangeEvent, type JSX } from "react";
import { useMapEvent } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useKeyPressEvent } from "react-use";
import { useFocus } from "../../hooks/useFocus";
import { find } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";
import { StateIcon, type SearchState } from "../StateIcon";

export function SearchBox(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputRef, setInputFocus] = useFocus();
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [value, setValue] = useControllableState({ defaultValue: "" });
  const [searching, setSearching] = useState<SearchState>(undefined);
  const map = useMapEvent("moveend", () => {
    if (searching === "busy") {
      setSearching("ok");
    }
  });

  useEffect(() => {
    if (isOpen) {
      setInputFocus();
    }
  }, [isOpen, setInputFocus]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearching(undefined);
    setValue(e.target.value);
  };

  const handleCancel = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    setValue("");
    setSearching(undefined);
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
      <Collapse in={isOpen} animate>
        <Box p="4px">
          <InputGroup>
            <InputLeftElement>
              <StateIcon state={searching} />
            </InputLeftElement>
            <Input
              name="search"
              borderWidth={2}
              borderColor="rgba(0,0,0,0.2)"
              focusBorderColor="rgba(0,0,0,0.2)"
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
        </Box>
      </Collapse>
    </Control>
  );
}
