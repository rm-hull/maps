import { IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { type LatLngTuple } from "leaflet";
import { useState, type ChangeEvent, type JSX } from "react";
import { find } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";
import { StateIcon, type SearchState } from "../StateIcon";

interface CustomSearchProps {
  disabled?: boolean;
  searchTerm?: string;
  onUpdate: (latLng: LatLngTuple, searchTerm: string) => void;
}

export function CustomSearch({ disabled = false, searchTerm = "", onUpdate }: CustomSearchProps): JSX.Element {
  const [value, setValue] = useState(searchTerm);
  const [searching, setSearching] = useState<SearchState>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    setSearching(undefined);
  };

  const handleCustomSearch = async (): Promise<void> => {
    try {
      setSearching("busy");
      const data = await find(value, 1);
      if (data.header.totalresults === 0) {
        setSearching("not-found");
        return;
      }

      const { geometryX, geometryY } = data.results[0].gazetteerEntry;
      const latLng = toLatLng([geometryX, geometryY]);
      onUpdate(latLng, value);
      setSearching("ok");
    } catch (err) {
      console.log({ err });
      setSearching("error");
    }
  };

  return (
    <InputGroup size="sm">
      <Input value={value} onChange={handleChange} placeholder="search" disabled={disabled} />
      <InputRightElement>
        <IconButton
          variant="none"
          size="sm"
          aria-label="Find location"
          icon={<StateIcon state={searching} />}
          isDisabled={disabled || searching === "ok"}
          onClick={() => {
            handleCustomSearch().catch(console.error);
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
}
