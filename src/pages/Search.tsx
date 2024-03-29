import { Spinner } from "@chakra-ui/react";
import { type JSX } from "react";
import { useParams } from "react-router-dom";
import Notice from "../components/Notice";
import OSMap from "../components/map/OSMap";
import useFind from "../hooks/useFind";
import { toLatLng } from "../services/osdatahub/helpers";
import SettingsModal from "../components/settings/SettingsModal";
import useSettings from "../hooks/useSettings";

export default function Search(): JSX.Element {
  const { isOpen, onClose } = useSettings();
  const { query } = useParams<{ query: string }>();
  const { data, isLoading, error } = useFind(query ?? "bloerew");

  if (error !== null) {
    return <Notice>Error: {error.message}</Notice>;
  }

  if (isLoading || data === undefined) {
    return (
      <Notice>
        Please wait... <Spinner size="sm" />
      </Notice>
    );
  }

  if (data.header.totalresults === 0) {
    return <Notice>No results for: {query}</Notice>;
  }

  const { geometryX, geometryY } = data.results[0].gazetteerEntry;
  const latLng = toLatLng([geometryX, geometryY]);
  return (
    <>
      <OSMap center={latLng} />
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
