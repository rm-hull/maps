import { Code, Link, Strong, Text, VStack } from "@chakra-ui/react";

export function About() {
  return (
    <VStack align="left">
      <Text>
        UK Ordance Survey maps, supporting multiple styles and points of interest. By default, visiting this site will
        center on Ambleside (for no particular reason). If you want to start (or sniff around) at a particular town or
        postcode, add it to the URL.
      </Text>

      <Text>
        Source:{" "}
        <Strong>
          <Link target="_blank" rel="noopener noreferrer" color="blue.400" href="https://github.com/rm-hull/maps">
            https://github.com/rm-hull/maps
          </Link>
        </Strong>
      </Text>
      <Text>
        Build info: <Code>{import.meta.env.VITE_GIT_COMMIT_HASH}</Code>, {import.meta.env.VITE_GIT_COMMIT_DATE}
      </Text>
    </VStack>
  );
}
