import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { greenMarker } from "@/icons";
import { Collapsible, Input, InputGroup, useControllableState, useDisclosure } from "@chakra-ui/react";
import { LatLng } from "leaflet";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { Marker, useMapEvent } from "react-leaflet";
import { useKeyPressEvent } from "react-use";
import { useFocus } from "../../../hooks/useFocus";
import { find } from "../../../services/osdatahub";
import { toLatLng } from "../../../services/osdatahub/helpers";
import { type Response, type GazetteerEntry } from "../../../services/osdatahub/types";
import { type SearchState, StateIcon } from "../../StateIcon";
import { useColorModeValue } from "../../ui/color-mode";
import { Control } from "../Control";
import { NearestInfo } from "../NearestInfo";
import { PopupPassthrough } from "../PopupPassthrough";
import { SearchResults } from "./SearchResults";

export function SearchBox() {
  const { settings } = useGeneralSettings();
  const { open, onOpen, onClose } = useDisclosure();
  const [inputRef, setInputFocus] = useFocus();
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [value, setValue] = useControllableState({ defaultValue: "" });
  const [searching, setSearching] = useState<SearchState>();
  const [position, setPosition] = useState<LatLng | undefined>();
  const [response, setResponse] = useState<Response | undefined>();
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

  const resetSearch = (): void => {
    setPosition(undefined);
    setSearching(undefined);
    setResponse(undefined);
  };

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    resetSearch();
    setValue(e.target.value);
  }, []);

  const handleCancel = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    setValue("");
    resetSearch();
    onClose();
  };

  const handleSearch = async (): Promise<void> => {
    if (!value.trim()) {
      return;
    }

    try {
      setSearching("busy");
      const data = await find(value, settings?.maxSearchResults ?? 5);
      if (data.header.totalresults === 0 || !data.results) {
        setSearching("not-found");
        setResponse(undefined);
        return;
      }

      if (data.header.totalresults > 1) {
        setSearching("multiple");
        setResponse(data);
        return;
      }

      handleSelect(data.results[0].gazetteerEntry);
    } catch (e) {
      setSearching("error");
      console.error(e);
    }
  };

  const handleSelect = useCallback(({ geometryX, geometryY }: GazetteerEntry) => {
    const latlng = toLatLng([geometryX, geometryY]);
    setPosition(latlng);
    setResponse(undefined);
    map.flyTo(latlng, map.getZoom());
    setSearching("ok");
  }, []);

  useKeyPressEvent("/", onOpen);
  useKeyPressEvent("Enter", () => {
    handleSearch().catch(console.error);
  });
  useKeyPressEvent("Escape", handleCancel);

  return (
    <Control position="bottomright" prepend>
      <Collapsible.Root open={open}>
        <Collapsible.Content p="4px">
          {response?.results && <SearchResults response={response} onSelect={handleSelect} />}
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
              <NearestInfo latLng={position} render={PopupPassthrough} />
            </Marker>
          )}
        </Collapsible.Content>
      </Collapsible.Root>
    </Control>
  );
}
