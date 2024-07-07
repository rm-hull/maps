import { Spinner } from "@chakra-ui/react";
import { type JSX } from "react";
import { useParams } from "react-router-dom";
import Notice from "../components/Notice";
import useFind from "../hooks/useFind";
import { toLatLng } from "../services/osdatahub/helpers";
import Home from "./Home";

export default function Search(): JSX.Element {
  const { query } = useParams<{ query: string }>();
  const { data, isLoading, error } = useFind(query ?? "bloerew", 10);

  if (error !== null) {
    return <Notice header="Error">{error.message}</Notice>;
  }

  if (isLoading || data === undefined) {
    return (
      <Notice
        header={
          <>
            Please wait... <Spinner size="sm" />
          </>
        }
      />
    );
  }

  if (data.header.totalresults === 0) {
    return <Notice header={"No results for: " + query} />;
  }

  const { geometryX, geometryY } = data.results[0].gazetteerEntry;
  const latLng = toLatLng([geometryX, geometryY]);
  return <Home latLng={latLng} />;
}
