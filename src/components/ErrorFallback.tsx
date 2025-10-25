import { Alert, Code, Container, Heading, Span } from "@chakra-ui/react";
import * as Sentry from "@sentry/browser";
import { ErrorInfo, useEffect } from "react";
import { useReadableStack } from "@/hooks/useReadableStack";

interface ErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
}

export function ErrorFallback({ error, errorInfo }: ErrorFallbackProps) {
  const { stack, loading } = useReadableStack(error);

  useEffect(() => {
    if (!loading) {
      Sentry.captureException(error, { extra: { stack, componentStack: errorInfo?.componentStack } });
    }
  }, [error, loading, stack, errorInfo]);

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
