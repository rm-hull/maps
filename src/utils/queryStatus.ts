import { QueryStatus } from "react-query";
import { SearchState } from "../components/StateIcon";

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
