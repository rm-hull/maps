import { ChakraProvider, theme } from "@chakra-ui/react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { type JSX, type ReactElement, type ReactNode } from "react";

const AllProviders = ({ children }: { children?: ReactNode }): JSX.Element => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions): RenderResult =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
