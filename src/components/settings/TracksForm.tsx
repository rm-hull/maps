import {
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, useState, type JSX } from "react";
import { fromReactQuery, StateIcon } from "../StateIcon";
import { useGeoJSON } from "../../hooks/useGeoJSON";
import { SupportedMimeTypes } from "../../services/geojson";
import { useQueryClient } from "react-query";

export function TracksForm(): JSX.Element {
  const [type, setType] = useState<SupportedMimeTypes>(SupportedMimeTypes.GPX);
  const [url, setUrl] = useState<string>("");
  const queryClient = useQueryClient();
  const { isLoading, status, refetch } = useGeoJSON(url, type);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUrl(event.target.value);
    queryClient.removeQueries(["geojson"]);
    if (event.target.value.endsWith(".kml")) {
      setType(SupportedMimeTypes.KML);
    } else if (event.target.value.endsWith(".gpx")) {
      setType(SupportedMimeTypes.GPX);
    }
  };

  const handleTypeChange = (type: SupportedMimeTypes) => {
    setType(type);
  };

  const handleClick = () => {
    queryClient.invalidateQueries(["geojson"]);
    refetch();
  };

  const state = fromReactQuery(status);

  return (
    <VStack gap={6}>
      <FormControl display="flex" alignItems="flex-start">
        <FormLabel htmlFor="type" mb={0}>
          Type:
        </FormLabel>
        <RadioGroup id="type" onChange={handleTypeChange} value={type}>
          <HStack align="left">
            <Radio value={SupportedMimeTypes.KML}>KML</Radio>
            <Radio value={SupportedMimeTypes.GPX}>GPX</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>

      <FormControl display="flex" alignItems="flex-start">
        <FormLabel htmlFor="url" mt={1}>
          URL:
        </FormLabel>
        <InputGroup size="sm">
          <Input id="url" value={url} onChange={handleChange} isDisabled={isLoading} />
          <InputRightElement>
            <IconButton
              variant="none"
              size="sm"
              aria-label="Fetch Tracks"
              icon={<StateIcon state={state} />}
              isDisabled={state === "ok"}
              onClick={handleClick}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </VStack>
  );
}
