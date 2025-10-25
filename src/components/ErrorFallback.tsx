import { Alert, Code, Container, Heading, Span } from "@chakra-ui/react";
import * as Sentry from "@sentry/browser";
import { useEffect } from "react";
import { useReadableStack } from "@/hooks/useReadableStack";

interface ErrorFallbackProps {
  error: Error;
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  const { stack, loading } = useReadableStack(error);

  useEffect(() => {
    Sentry.captureException(error, { extra: { stack } });
  }, [error, stack]);

  return (
    <Container maxWidth="container.lg">
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Something went wrong:</Alert.Title>
          <Alert.Description>{error.message}</Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Container m={5}>
        <Heading size="sm">
          Stack trace
          {loading && <Span color="gray.500"> (resolving source maps…)</Span>}
        </Heading>
        <Code background="none">
          <pre>{stack}</pre>
        </Code>
      </Container>
    </Container>
  );
}
