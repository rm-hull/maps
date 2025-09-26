import { Tooltip } from "@/components/ui/tooltip";
import { Badge, DataList, HStack, Heading, Link, List, ListItem, Text } from "@chakra-ui/react";
import { type LatLngBounds } from "leaflet";
import { FaExclamationCircle } from "react-icons/fa";
import { Marker, Popup } from "react-leaflet";
import { Link as ReactRouterLink } from "react-router-dom";
import { useCachedQuery } from "../../../../hooks/useCachedQuery";
import { useCompanyData } from "../../../../hooks/useCompanyData";
import { useErrorToast } from "../../../../hooks/useErrorToast";
import { countIcon } from "../../../../icons";
import { CompanyData } from "../../../../services/companyData/types";
import { toLatLng } from "../../../../services/osdatahub/helpers";

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

function accountsOverdue(company: CompanyData): boolean {
  return (company.accounts_next_due_date?.getTime() ?? Infinity) < Date.now();
}

function confirmationStatementOverdue(company: CompanyData): boolean {
  return (company.conf_stmt_next_due_date?.getTime() ?? Infinity) < Date.now();
}

interface OverdueProps {
  isOverdue: boolean;
  dueDate?: Date;
  label: string;
}

function Overdue({ isOverdue, dueDate, label }: OverdueProps) {
  if (!isOverdue) {
    return null;
  }

  return (
    <Tooltip content={`Due: ${dueDate?.toDateString()}`}>
      <HStack display="inline-flex" gap={1} color="red.700" fontWeight="bold" cursor="help">
        <FaExclamationCircle /> {label} overdue
      </HStack>
    </Tooltip>
  );
}

interface CompanyListPopupProps {
  companies: CompanyData[];
}

function CompanyListPopup({ companies }: CompanyListPopupProps) {
  return (
    <Popup maxWidth={400} closeButton={false}>
      <List.Root gap={1} maxHeight={300} overflowY="auto">
        {companies.toSorted(byAddressLine1).map((company) => (
          <ListItem key={company.company_number} p={2} borderBottom="1px solid" borderColor="gray.200">
            <HStack gap={2} alignItems="start" justifyContent="space-between">
              <Heading size="sm" truncate>
                <Link asChild target="_blank" rel="noreferrer" outlineOffset={0}>
                  <ReactRouterLink
                    to={`https://find-and-update.company-information.service.gov.uk/company/${company.company_number}`}
                  >
                    {company.company_name}
                  </ReactRouterLink>
                </Link>
              </Heading>
              <Badge colorPalette={companyStatusColorScheme(company.company_status)} fontSize="xs">
                {company.company_status}
              </Badge>
            </HStack>
            <Text fontSize="sm" truncate textTransform="capitalize">
              {company.incorporation_date.toLocaleDateString("en-GB")} | {company.company_category} |{" "}
              {company.accounts_account_category.toLowerCase()}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {address(company)}
            </Text>
            {company.sic_code_1 !== "None Supplied" && (
              <DataList.Root gap={0} orientation="horizontal">
                {[company.sic_code_1, company.sic_code_2, company.sic_code_3, company.sic_code_4]
                  .filter(Boolean)
                  .map((sicCode, index) => {
                    const [code, descr] = sicCode.split(/ - /, 2);
                    return (
                      <DataList.Item
                        key={index}
                        fontSize="xs"
                        color="gray.600"
                        alignItems="start"
                        lineHeight={1.4}
                        borderLeftWidth={2}
                        ml={2}
                        gap={0}
                      >
                        <DataList.ItemLabel width="50px" minWidth="initial" pl={1}>
                          {code} -
                        </DataList.ItemLabel>
                        <DataList.ItemValue>{descr}</DataList.ItemValue>
                      </DataList.Item>
                    );
                  })}
              </DataList.Root>
            )}
            <HStack gap={3} pt={1}>
              <Overdue isOverdue={accountsOverdue(company)} dueDate={company.accounts_next_due_date} label="Accounts" />
              <Overdue
                isOverdue={confirmationStatementOverdue(company)}
                dueDate={company.conf_stmt_next_due_date}
                label="Confirmation statement"
              />
            </HStack>
          </ListItem>
        ))}
      </List.Root>
    </Popup>
  );
}

interface CompanyDataLayerProps {
  bounds: LatLngBounds;
}

export function CompanyDataLayer({ bounds }: CompanyDataLayerProps) {
  const { data, error } = useCachedQuery(useCompanyData(bounds));
  useErrorToast("company-data-error", "Error loading Company data", error);

  return Object.entries(data?.results ?? {}).map(([key, results]) => (
    <Marker
      key={key}
      position={toLatLng([results[0].easting, results[0].northing])}
      icon={countIcon("orange", results.length)}
    >
      <CompanyListPopup companies={results} />
    </Marker>
  ));
}
