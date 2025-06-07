import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  useBoolean,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState} from "react";
import { fromReactQuery, StateIcon } from "../StateIcon";
import { useGeoJSON } from "../../hooks/useGeoJSON";
import { SupportedMimeTypes } from "../../services/geojson";
import { useQueryClient } from "react-query";

const CORS_PROXY = import.meta.env.VITE_CORS_PROXY as string;

export function TracksForm() {
  const [type, setType] = useState<SupportedMimeTypes>(SupportedMimeTypes.GPX);
  const [url, setUrl] = useState<string>("");
  const [useCorsProxy, { toggle: setUseCorsProxy }] = useBoolean();
  const queryClient = useQueryClient();
  const { isLoading, status, refetch, error } = useGeoJSON(useCorsProxy ? `${CORS_PROXY}${url}` : url, type);

  console.log({ error });

  useEffect(() => {
    queryClient.removeQueries(["geojson"]);
  }, []);

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

      <FormControl isInvalid={!!error}>
        <InputGroup size="sm">
          <Input
            placeholder="Enter URL (either GPX or KML)"
            value={url}
            onChange={handleChange}
            isDisabled={isLoading}
          />
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
        <FormErrorMessage display="block">{error?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <InputGroup>
          <Checkbox onChange={setUseCorsProxy} checked={useCorsProxy}>
            Use CORS proxy
          </Checkbox>
        </InputGroup>
      </FormControl>

      {error && error.message}
    </VStack>
  );
}
