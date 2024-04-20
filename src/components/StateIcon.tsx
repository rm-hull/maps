import { CircularProgress } from "@chakra-ui/react";
import { FiAlertTriangle, FiCheck, FiSearch, FiXCircle } from "react-icons/fi";
import { type JSX } from "react";

export type SearchState = "ok" | "error" | "busy" | "not-found" | undefined;

interface StateIconProps {
  state: SearchState;
}

export default function StateIcon({ state }: StateIconProps): JSX.Element {
  switch (state) {
    case "error":
      return <FiXCircle color="red" />;
    case "ok":
      return <FiCheck color="green" />;
    case "not-found":
      return <FiAlertTriangle color="orange" />;
    case "busy":
      return <CircularProgress isIndeterminate size={4} />;
    default:
      return <FiSearch />;
  }
}
