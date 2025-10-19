import { Alert, Container } from "@chakra-ui/react";
import { type JSX, type PropsWithChildren } from "react";

interface NoticeProps {
  header: JSX.Element | string;
}

export function Notice({ header, children }: PropsWithChildren<NoticeProps>) {
  return (
    <Container maxWidth="container.lg">
      <Alert.Root>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{header}</Alert.Title>
          <Alert.Description>{children}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </Container>
  );
}
