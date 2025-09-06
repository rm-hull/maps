import { IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { type ChangeEvent, useState } from "react";
import { find } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";
import { type SearchState, StateIcon } from "../StateIcon";

interface CustomSearchProps {
  isDisabled?: boolean;
  searchTerm?: string;
  onUpdate: (latLng: LatLng, searchTerm: string) => void;
}

export function CustomSearch({ isDisabled = false, searchTerm = "", onUpdate }: CustomSearchProps) {
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
      <Input value={value} onChange={handleChange} placeholder="search" disabled={isDisabled} />
      <InputRightElement>
        <IconButton
          variant="none"
          size="sm"
          aria-label="Find location"
          icon={<StateIcon state={searching} />}
          isDisabled={isDisabled || searching === "ok"}
          onClick={() => {
            handleCustomSearch().catch(console.error);
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
}
