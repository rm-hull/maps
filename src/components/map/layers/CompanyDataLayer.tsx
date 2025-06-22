import { Badge, HStack, Heading, Link, List, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { LayerGroup, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { CompanyData } from "../../../services/companyData/types";
import { type LatLngBounds } from "leaflet";
import { Link as ReactRouterLink } from "react-router-dom";
import { countIcon } from "../../../icons";
import { toLatLng } from "../../../services/osdatahub/helpers";
import { useCachedQuery } from "../../../hooks/useCachedQuery";
import { useCompanyData } from "../../../hooks/useCompanyData";
import { useErrorToast } from "../../../hooks/useErrorToast";
import { useGeneralSettings } from "../../../hooks/useGeneralSettings";
import { useState } from "react";

function address(companyData: CompanyData): string {
  return [
    companyData.reg_address_care_of,
    companyData.reg_address_po_box,
    companyData.reg_address_address_line_1,
    companyData.reg_address_address_line_2,
    companyData.reg_address_post_town,
    companyData.reg_address_county,
    companyData.reg_address_country,
    companyData.reg_address_post_code,
  ]
    .filter(Boolean)
    .join(", ");
}

function byAddressLine1(a: CompanyData, b: CompanyData): number {
  const getAddressNumber = (address?: string) => {
    if (!address) return NaN;
    const match = address.match(/^\d+/);
    return match ? parseInt(match[0], 10) : NaN;
  };

  const numA = getAddressNumber(a.reg_address_address_line_1);
  const numB = getAddressNumber(b.reg_address_address_line_1);

  if (!isNaN(numA) && !isNaN(numB)) {
    if (numA !== numB) {
      return numA - numB;
    }
  } else if (!isNaN(numA)) {
    return -1;
  } else if (!isNaN(numB)) {
    return 1;
  }

  return a.company_name.localeCompare(b.company_name, undefined, { sensitivity: "base" });
}

function companyStatusColorScheme(status: string) {
  status = status.toUpperCase();

  if (status.includes("STRIKE OFF")) {
    return "orange";
  } else if (status.includes("LIQUIDATION")) {
    return "red";
  } else if (status.includes("ADMINISTRATION")) {
    return "yellow";
  } else if (status.includes("ACTIVE")) {
    return "green";
  } else if (status.includes("DISSOLVED")) {
    return "red";
  }

  return "gray";
}

interface CompanyListPopupProps {
  companies: CompanyData[];
}

function CompanyListPopup({ companies }: CompanyListPopupProps) {
  return (
    <Popup maxWidth={400} closeButton={false}>
      <List spacing={1} maxHeight={300} overflowY="auto">
        {companies.toSorted(byAddressLine1).map((company) => (
          <ListItem key={company.company_number} p={2} borderBottom="1px solid" borderColor="gray.200">
            <HStack spacing={2} alignItems="start" justifyContent="space-between">
              <Heading size="sm" isTruncated>
                <Link
                  as={ReactRouterLink}
                  to={`https://find-and-update.company-information.service.gov.uk/company/${company.company_number}`}
                  target="_blank"
                  rel="noreferrer"
                  outlineOffset={0}
                >
                  {company.company_name}
                </Link>
              </Heading>
              <Badge colorScheme={companyStatusColorScheme(company.company_status)} fontSize="xs" isTruncated>
                {company.company_status}
              </Badge>
            </HStack>
            <Text fontSize="sm" isTruncated textTransform="capitalize">
              {new Date(company.incorporation_date).toLocaleDateString("en-GB")} | {company.company_category} |{" "}
              {company.accounts_account_category.toLowerCase()}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {address(company)}
            </Text>
            <UnorderedList>
              {[company.sic_code_1, company.sic_code_2, company.sic_code_3, company.sic_code_4]
                .filter(Boolean)
                .map((sicCode, index) => (
                  <ListItem key={index} fontSize="xs" color="gray.600">
                    {sicCode}
                  </ListItem>
                ))}
            </UnorderedList>
          </ListItem>
        ))}
      </List>
    </Popup>
  );
}

interface CompaniesProps {
  bounds: LatLngBounds;
}

function Companies({ bounds }: CompaniesProps) {
  const { data, error } = useCachedQuery(useCompanyData(bounds));
  useErrorToast("company-data-error", "Error loading Company data", error);

  return (
    <>
      {Object.entries(data?.results ?? {}).map(([key, results]) => (
        <Marker
          key={key}
          position={toLatLng([results[0].easting, results[0].northing])}
          icon={countIcon("orange", results.length)}
        >
          <CompanyListPopup companies={results} />
        </Marker>
      ))}
    </>
  );
}

interface CompanyDataLayerProps {
  minZoom: number;
}

export function CompanyDataLayer({ minZoom }: CompanyDataLayerProps) {
  const map = useMap();
  const [settings] = useGeneralSettings();
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
  const [overlayChecked, setOverlayChecked] = useState<Record<string, boolean>>({
    "Company Data": settings?.autoSelect?.companyData ?? false,
  });

  const handleOverlayChange = (layer: string, checked: boolean) => {
    setOverlayChecked((prevState) => ({
      ...prevState,
      [layer]: checked,
    }));
  };

  useMapEvents({
    moveend() {
      setBounds(map.getBounds());
    },
    zoomend() {
      setBounds(map.getBounds());
    },
    overlayadd(event) {
      handleOverlayChange(event.name, true);
    },
    overlayremove(event) {
      handleOverlayChange(event.name, false);
    },
  });

  if (map.getZoom() < minZoom) {
    return null;
  }

  return <LayerGroup>{overlayChecked["Company Data"] && <Companies bounds={bounds} />}</LayerGroup>;
}
