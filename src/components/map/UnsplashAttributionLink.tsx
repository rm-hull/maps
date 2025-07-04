import { Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

interface UnsplashAttributionLinkProps {
  name: string;
  link: string;
}

export function UnsplashAttributionLink({ name, link }: UnsplashAttributionLinkProps) {
  return (
    <Text>
      Photo by{" "}
      <Link
        as={ReactRouterLink}
        to={link + `?utm_source=${encodeURIComponent("https://www.destructuring-bind.org/maps")}&utm_medium=referral`}
        isExternal
      >
        {name}
      </Link>{" "}
      (Unsplash)
    </Text>
  );
}
