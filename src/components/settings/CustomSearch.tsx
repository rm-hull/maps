import { IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { type LatLngTuple } from "leaflet";
import { useState, type ChangeEvent, type JSX } from "react";
import { FiCheck, FiSearch, FiXCircle } from "react-icons/fi";
import { find } from "../../services/osdatahub";
import { toLatLng } from "../../services/osdatahub/helpers";

interface CustomSearchProps {
  disabled?: boolean;
  searchTerm?: string;
  onUpdate: (latLng: LatLngTuple, searchTerm: string) => void;
}

interface StateIconProps {
  state?: "ok" | "error";
}

function StateIcon({ state }: StateIconProps): JSX.Element {
  if (state === "error") {
    return <FiXCircle color="red" />;
  } else if (state === "ok") {
    return <FiCheck color="green" />;
  } else {
    return <FiSearch />;
  }
}

export default function CustomSearch({ disabled = false, searchTerm = "", onUpdate }: CustomSearchProps): JSX.Element {
  const [value, setValue] = useState(searchTerm);
  const [status, setStatus] = useState<"ok" | "error">();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    setStatus(undefined);
  };

  const handleCustomSearch = async (): Promise<void> => {
    try {
      const data = await find(value, 1);
      const { geometryX, geometryY } = data.results[0].gazetteerEntry;
      const latLng = toLatLng([geometryX, geometryY]);
      onUpdate(latLng, value);
      setStatus("ok");
    } catch (err) {
      console.log({ err });
      setStatus("error");
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
          icon={<StateIcon state={status} />}
          isDisabled={disabled || status === "ok"}
          onClick={handleCustomSearch}
        />
      </InputRightElement>
    </InputGroup>
  );
}
