import { CircularProgress } from "@chakra-ui/react";
import { FiAlertTriangle, FiCheck, FiSearch, FiXCircle } from "react-icons/fi";
import { type JSX } from "react";
import { QueryStatus } from "react-query";

export type SearchState = "ok" | "error" | "busy" | "not-found" | undefined;

interface StateIconProps {
  state: SearchState;
}

export function fromReactQuery(status: QueryStatus): SearchState {
  switch (status) {
    case "error":
      return "error";
    case "idle":
      return undefined;
    case "loading":
      return "busy";
    case "success":
      return "ok";
  }
}

export function StateIcon({ state }: StateIconProps): JSX.Element {
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
