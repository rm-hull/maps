import { Box, Listbox, createListCollection, Text, VStack } from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import { GazetteerEntry, type Response } from "../../../services/osdatahub/types";
import { SearchIcon } from "./SearchIcon";

function dedupe(value: string | undefined, index: number, array: (string | undefined)[]): boolean {
  return array.indexOf(value) === index;
}

interface SearchResponseProps {
  response: Response;
  onSelect: (gazetteerEntry: GazetteerEntry) => void;
}

type SearchResultItemType = {
  label: string;
  value: string;
  type: string;
  icon: ReactNode;
  data: GazetteerEntry;
};

type SearchResultItemProps = {
  item: SearchResultItemType;
  onSelect: (gazetteerEntry: GazetteerEntry) => void;
};

function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  const handleClick = useCallback(() => onSelect(item.data), [item.data, onSelect]);

  return (
    <Listbox.Item item={item} onClick={handleClick}>
      <Box display="flex" alignItems="start" gap={3}>
        <Box color="fg.muted" mt={0.5}>
          {item.icon}
        </Box>
        <VStack alignItems="start" gap={0}>
          <Listbox.ItemText>{item.label}</Listbox.ItemText>
          <Text fontSize="xs" color="fg.muted">
            {item.type}
          </Text>
        </VStack>
      </Box>
    </Listbox.Item>
  );
}

export function SearchResults({ response, onSelect }: SearchResponseProps) {
  const collection = createListCollection({
    items:
      response.results?.map(
        (result) =>
          ({
            label: [
              result.gazetteerEntry.name1,
              result.gazetteerEntry.populatedPlace,
              result.gazetteerEntry.countyUnitary,
              result.gazetteerEntry.districtBorough,
              result.gazetteerEntry.postcodeDistrict,
              result.gazetteerEntry.country,
            ]
              .filter(Boolean)
              .filter(dedupe)
              .join(", "),
            value: result.gazetteerEntry.id,
            type: result.gazetteerEntry.localType,
            icon: <SearchIcon localType={result.gazetteerEntry.localType} />,
            data: result.gazetteerEntry,
          }) as SearchResultItemType
      ) ?? [],
  });

  return (
    <Listbox.Root collection={collection} width="500px">
      <Listbox.Content>
        {collection.items.map((item) => (
          <SearchResultItem key={item.value} item={item} onSelect={onSelect} />
        ))}
      </Listbox.Content>
    </Listbox.Root>
  );
}
