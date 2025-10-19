import { Button, Input, InputGroup } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { type ChangeEvent, useState, useCallback } from "react";
import { find } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";
import { type SearchState, StateIcon } from "../StateIcon";

interface CustomSearchProps {
  disabled?: boolean;
  searchTerm?: string;
  onUpdate: (latLng: LatLng, searchTerm: string) => void;
}

export function CustomSearch({ disabled = false, searchTerm = "", onUpdate }: CustomSearchProps) {
  const [value, setValue] = useState(searchTerm);
  const [searching, setSearching] = useState<SearchState>();

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    setSearching(undefined);
  }, []);

  const handleCustomSearch = useCallback(async (): Promise<void> => {
    try {
      setSearching("busy");
      const data = await find(value, 1);
      if (data.header.totalresults === 0 || !data.results) {
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
  }, [onUpdate, value]);

  const handleClick = useCallback(() => {
    handleCustomSearch().catch(console.error);
  }, [handleCustomSearch]);

  return (
    <InputGroup
      endElement={
        <Button
          variant="plain"
          size="xs"
          aria-label="Find location"
          disabled={disabled || searching === "ok"}
          onClick={handleClick}
        >
          <StateIcon state={searching} />
        </Button>
      }
    >
      <Input size="xs" value={value} onChange={handleChange} placeholder="search" disabled={disabled} />
    </InputGroup>
  );
}
