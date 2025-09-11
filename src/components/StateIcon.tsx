import { Spinner } from "@chakra-ui/react";
import { FiAlertTriangle, FiCheck, FiSearch, FiXCircle } from "react-icons/fi";
export type SearchState = "ok" | "error" | "busy" | "not-found" | undefined;

interface StateIconProps {
  state: SearchState;
}

export function StateIcon({ state }: StateIconProps) {
  switch (state) {
    case "error":
      return <FiXCircle color="red" />;
    case "ok":
      return <FiCheck color="green" />;
    case "not-found":
      return <FiAlertTriangle color="orange" />;
    case "busy":
      return <Spinner size="xs" color="blue.600" colorPalette="blue" />;
    default:
      return <FiSearch />;
  }
}
