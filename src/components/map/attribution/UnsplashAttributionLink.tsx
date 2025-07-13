import { Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

interface UnsplashAttributionLinkProps {
  name: string;
  link: string;
}

export function UnsplashAttributionLink({ name, link }: UnsplashAttributionLinkProps) {
  const url = new URL(link);
  url.searchParams.set("utm_source", "https://www.destructuring-bind.org/maps");
  url.searchParams.set("utm_medium", "referral");

  return (
    <Text>
      Photo by{" "}
      <Link as={ReactRouterLink} to={url.toString()} isExternal>
        {name}
      </Link>{" "}
      (Unsplash)
    </Text>
  );
}
