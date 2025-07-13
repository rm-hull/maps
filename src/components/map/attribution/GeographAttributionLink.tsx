import { Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

interface GeographAttributionLinkProps {
  name: string;
  date?: string;
  link: string;
}

export function GeographAttributionLink({ name, date, link }: GeographAttributionLinkProps) {
  const url = new URL(link);
  url.searchParams.set("utm_source", "https://www.destructuring-bind.org/maps");
  url.searchParams.set("utm_medium", "referral");

  return (
    <Text>
      CC licensed by{" "}
      <Link as={ReactRouterLink} to={url.toString()} isExternal>
        {name}
      </Link>
      {date && `, ${date}`}
    </Text>
  );
}
