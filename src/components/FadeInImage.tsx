import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Center, Image, Spinner, Tag, Text, VStack } from "@chakra-ui/react";
import { LuCircleX, LuSkull } from "react-icons/lu";
import { useInView } from "framer-motion";

type ImageDetails = { src?: string; alt?: string; attribution?: ReactNode };

export type ImageLoaderFn = () => Promise<ImageDetails>;

interface FadeInImageProps extends ImageDetails {
  loader?: ImageLoaderFn;
  height?: number;
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10000;

export function FadeInImage({ loader, src, alt, height, attribution, ...rest }: FadeInImageProps) {
  // Create a stable key from props to detect changes
  // Note: attribution is a ReactNode so we can't JSON.stringify it
  const propsKey = useMemo(
    () => `${loader?.toString()}_${src}_${alt}_${typeof attribution}`,
    [loader, src, alt, attribution]
  );

  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentKey, setCurrentKey] = useState(propsKey);
  const [loadedImageDetails, setLoadedImageDetails] = useState<ImageDetails | null>(null);

  // Reset state when props change (outside of effect)
  if (propsKey !== currentKey) {
    setCurrentKey(propsKey);
    setLoadedImageDetails(null);
    setError(false);
    setLoaded(false);
  }

  // If there's no loader and no src, mark as loaded immediately
  if (!loader && !src && !isLoaded) {
    setLoaded(true);
  }

  // Use loaded details if available, otherwise fall back to props
  const imageDetails = loadedImageDetails || { src, alt, attribution };

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });

  useEffect(() => {
    if (!loader) return;

    let isMounted = true;

    loader()
      .then((resolvedUrl) => {
        if (isMounted) {
          setLoadedImageDetails(resolvedUrl);
        }
        return;
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loader, src]);

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
    } else if (!imageDetails.src) {
      return (
        <VStack gap={1}>
          <LuCircleX color="gray" size={72} />
          <Text fontSize="xs" color="fg.muted">
            No image available
          </Text>
        </VStack>
      );
    }
    return null;
  }, [imageDetails.src, isLoaded, error, isRetrying, retryCount]);

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
        <>
          <Image
            key={retryCount}
            src={imageDetails?.src}
            alt={imageDetails?.alt}
            onLoad={() => setLoaded(true)}
            onError={handleError}
            width="full"
            height="full"
            objectFit="cover"
            transition="opacity 0.2s ease-in-out"
            opacity={isLoaded ? 1 : 0}
          />
          {imageDetails?.attribution && (
            <Tag.Root
              position="absolute"
              bottom={0}
              right={0}
              m={1}
              p={0.5}
              variant="subtle"
              size="sm"
              fontSize="xs"
              colorScheme="gray"
              opacity={0.5}
            >
              <Tag.Label>{imageDetails.attribution}</Tag.Label>
            </Tag.Root>
          )}
        </>
      )}
    </Box>
  );
}