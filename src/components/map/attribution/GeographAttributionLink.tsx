import { Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

interface GeographAttributionLinkProps {
  name: string;
  date?: string;
  link: string;
}

export function GeographAttributionLink({ name, date, link }: GeographAttributionLinkProps) {
  return (
    <Text>
      CC licensed by{" "}
      <Link
        as={ReactRouterLink}
        to={link + `?utm_source=${encodeURIComponent("https://www.destructuring-bind.org/maps")}&utm_medium=referral`}
        isExternal
      >
        {name}
      </Link>
      {date && `, ${date}`}
    </Text>
  );
}
