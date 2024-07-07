import { Code, Link, Text, VStack } from "@chakra-ui/react";
import { type JSX } from "react";

export function About(): JSX.Element {
  return (
    <VStack spacing={4} align="left">
      <Text>
        UK Ordance Survey maps, supporting multiple styles and points of interest. By default, visiting this site will
        center on Ambleside (for no particular reason). If you want to start (or sniff around) at a particular town or
        postcode, add it to the URL.
      </Text>

      <VStack gap={0} align="left">
        <Text>
          <Link isExternal color="blue.400" href="https://github.com/rm-hull/maps">
            https://github.com/rm-hull/maps
          </Link>
        </Text>
        <Text>
          Build info: <Code>{import.meta.env.VITE_GIT_COMMIT_HASH}</Code>, {import.meta.env.VITE_GIT_COMMIT_DATE}
        </Text>
      </VStack>
    </VStack>
  );
}
