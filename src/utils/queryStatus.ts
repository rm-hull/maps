import { QueryStatus } from "@tanstack/react-query";
import { SearchState } from "../components/StateIcon";

export function fromReactQuery(status: QueryStatus): SearchState {
  switch (status) {
    case "error":
      return "error";
    case "pending":
      return "busy";
    case "success":
      return "ok";
  }
}
