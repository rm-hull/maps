import { Button, Checkbox, Field, HStack, Input, InputGroup, RadioGroup, VStack } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useGeoJSON } from "../../hooks/useGeoJSON";
import { SupportedMimeTypes } from "../../services/geojson";
import { fromReactQuery } from "../../utils/queryStatus";
import { StateIcon } from "../StateIcon";

const CORS_PROXY = import.meta.env.VITE_CORS_PROXY as string;

export function TracksForm() {
  const [type, setType] = useState<SupportedMimeTypes>(SupportedMimeTypes.GPX);
  const [url, setUrl] = useState<string>("");
  const [useCorsProxy, setUseCorsProxy] = useState<boolean | "indeterminate">(false);
  const queryClient = useQueryClient();
  const { isLoading, status, refetch, error } = useGeoJSON(useCorsProxy ? `${CORS_PROXY}${url}` : url, type);

  useEffect(() => {
    queryClient.removeQueries(["geojson"]);
  }, [queryClient]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUrl(event.target.value);
    queryClient.removeQueries(["geojson"]);
    if (event.target.value.endsWith(".kml")) {
      setType(SupportedMimeTypes.KML);
    } else if (event.target.value.endsWith(".gpx")) {
      setType(SupportedMimeTypes.GPX);
    }
  };

  const handleTypeChange = (type: string | null) => {
    if (type !== null) {
      setType(type as SupportedMimeTypes);
    }
  };

  const handleClick = () => {
    queryClient
      .invalidateQueries(["geojson"])
      .then(() => refetch())
      .catch(console.error);
  };

  const state = fromReactQuery(status);

  return (
    <VStack gap={6}>
      <Field.Root display="flex" alignItems="flex-start">
        <HStack>
          <Field.Label width="40px" htmlFor="type" mb={0}>
            Type:
          </Field.Label>
          <RadioGroup.Root id="type" onValueChange={(e) => handleTypeChange(e.value)} value={type}>
            <HStack align="left">
              <RadioGroup.Item value={SupportedMimeTypes.KML}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>KML</RadioGroup.ItemText>
              </RadioGroup.Item>
              <RadioGroup.Item value={SupportedMimeTypes.GPX}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>GPX</RadioGroup.ItemText>
              </RadioGroup.Item>
            </HStack>
          </RadioGroup.Root>
        </HStack>
      </Field.Root>

      <Field.Root invalid={!!error}>
        <HStack>
          <Field.Label width="40px">URL:</Field.Label>
          <InputGroup
            width="xl"
            endElement={
              <Button
                variant="plain"
                size="sm"
                aria-label="Fetch Tracks"
                disabled={state === "ok"}
                onClick={handleClick}
              >
                <StateIcon state={state} />
              </Button>
            }
          >
            <Input
              placeholder="Enter URL (either GPX or KML)"
              value={url}
              onChange={handleChange}
              disabled={isLoading}
            />
          </InputGroup>
          <Field.ErrorText display="block">{error?.message}</Field.ErrorText>
        </HStack>
      </Field.Root>

      <Field.Root>
        <Checkbox.Root onCheckedChange={(e) => setUseCorsProxy(e.checked)} checked={useCorsProxy}>
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>Use CORS proxy</Checkbox.Label>
        </Checkbox.Root>
      </Field.Root>
    </VStack>
  );
}
