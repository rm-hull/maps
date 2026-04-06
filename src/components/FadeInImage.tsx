import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Center, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { LuCircleX, LuSkull } from "react-icons/lu";
import { useInView } from "framer-motion";

type FadeInImageProps = {
  src?: string;
  alt: string;
  height?: number;
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10000;

export function FadeInImage({ src, alt, height, ...rest }: FadeInImageProps) {
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isRetrying) {
      timeoutId = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setIsRetrying(false);
      }, RETRY_DELAY_MS);
    }
    return () => clearTimeout(timeoutId);
  }, [isRetrying]);

  const placeholder = useCallback(() => {
    if (error) {
      return (
        <VStack gap={1}>
          <LuSkull color="tomato" size={72} />
          <Text fontSize="xs" color="fg.muted">
            Failed to load
          </Text>
        </VStack>
      );
    } else if (!src) {
      return (
        <VStack gap={1}>
          <LuCircleX color="gray" size={72} />
          <Text fontSize="xs" color="fg.muted">
            No image available
          </Text>
        </VStack>
      );
    } else if (isRetrying) {
      return (
        <VStack gap={1}>
          <Spinner color="blue" size="lg" />
          <Text fontSize="xs" color="fg.muted">
            Retrying ({retryCount + 1}/{MAX_RETRIES})...
          </Text>
        </VStack>
      );
    } else if (!isLoaded) {
      return <Spinner color="blue" size="lg" />;
    }
    return null;
  }, [src, isLoaded, error, isRetrying, retryCount]);

  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setIsRetrying(true);
    } else {
      setError(true);
    }
  }, [retryCount]);

  return (
    <Box
      ref={containerRef}
      position="relative"
      w="full"
      h={height}
      overflow="hidden"
      {...rest}
    >
      <Center position="absolute" top="0" left="0" w="100%" h="100%">
        {placeholder()}
      </Center>
      {isInView && (
        <Image
          key={retryCount}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          width="full"
          height="full"
          objectFit="cover"
          transition="opacity 0.2s ease-in-out"
          opacity={isLoaded ? 1 : 0}
        />
      )}
    </Box>
  );
}