"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  // React 19 / Next 16+ fix: suppress the <script> tag warning by
  // telling next-themes to use type="application/json" instead of
  // type="text/javascript", which React won't try to execute.
  const scriptProps = typeof window === "undefined" ? undefined : ({ type: "application/json" } as const);

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} scriptProps={scriptProps} />
    </ChakraProvider>
  );
}
