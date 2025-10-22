import { Button, InputGroup } from "@chakra-ui/react";
import { type LatLng } from "leaflet";
import { type ChangeEvent, type KeyboardEvent, useState, useCallback } from "react";
import { suggest } from "@/services/placenames";
import { find } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";
import { type SearchState, StateIcon } from "../StateIcon";
import { TypeaheadInput } from "../TypeaheadInput";

interface CustomSearchProps {
  disabled?: boolean;
  searchTerm?: string;
  onUpdate: (latLng: LatLng, searchTerm: string) => void;
}

export function CustomSearch({ disabled = false, searchTerm = "", onUpdate }: CustomSearchProps) {
  const [value, setValue] = useState(searchTerm);
  const [searching, setSearching] = useState<SearchState>();

  const handleCustomSearch = useCallback(async () => {
    try {
      setSearching("busy");
      const data = await find(value, { maxResults: 1 });
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

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setSearching(undefined);
  }, []);

  const handleClick = useCallback(() => {
    handleCustomSearch().catch(() => {
      // Handled in handleCustomSearch()
    });
  }, [handleCustomSearch]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCustomSearch().catch(() => {
          // Handled in handleCustomSearch()
        });
      }
    },
    [handleCustomSearch]
  );

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input.trim()) {
      return [];
    }
    const result = await suggest(input);
    return result.results.map((item) => item.name);
  }, []);

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
      <TypeaheadInput
        id="custom-search"
        name="custom-search"
        size="xs"
        inset="0px 1px"
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="off"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fetchSuggestions={fetchSuggestions}
      />
    </InputGroup>
  );
}
