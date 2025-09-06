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
      <Link asChild target="_blank" rel="noreferrer" outlineOffset={0}>
        <ReactRouterLink to={url.toString()}>{name}</ReactRouterLink>
      </Link>{" "}
      (Unsplash)
    </Text>
  );
}
