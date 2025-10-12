import { Box, Center, Image, Spinner, Tag } from "@chakra-ui/react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { LuCircleX, LuSkull } from "react-icons/lu";

type ImageDetails = { src?: string; alt?: string; attribution?: ReactNode };

export type ImageLoaderFn = () => Promise<ImageDetails>;

interface FadeInImageProps extends ImageDetails {
  loader?: ImageLoaderFn;
  height?: number;
}

export function FadeInImage({ loader, src, alt, height, attribution, ...rest }: FadeInImageProps) {
  // Create a stable key from props to detect changes
  // Note: attribution is a ReactNode so we can't JSON.stringify it
  const propsKey = useMemo(
    () => `${loader?.toString()}_${src}_${alt}_${typeof attribution}`,
    [loader, src, alt, attribution]
  );

  const [currentKey, setCurrentKey] = useState(propsKey);
  const [loadedImageDetails, setLoadedImageDetails] = useState<ImageDetails | null>(null);
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

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

  const placeholder = useCallback(() => {
    if (error) {
      return <LuSkull color="tomato" size={72} />;
    } else if (!isLoaded) {
      return <Spinner color="blue" size="lg" />;
    } else if (!imageDetails.src) {
      return <LuCircleX color="gray" size={72} />;
    }
    return null;
  }, [error, isLoaded, imageDetails.src]);

  const setLoadedFinished = useCallback(() => setLoaded(true), []);
  const setErrorOccurred = useCallback(() => setError(true), []);

  return (
    <Box position="relative" w="full" h={height} {...rest}>
      <Center position="absolute" top="0" left="0" w="100%" h="100%">
        {placeholder()}
      </Center>
      <Image
        src={imageDetails?.src}
        alt={imageDetails?.alt}
        onLoad={setLoadedFinished}
        onError={setErrorOccurred}
        width="full"
        height="full"
        objectFit="cover"
        transition="opacity 0.2s ease-in-out"
        opacity={isLoaded ? 1 : 0}
        loading="lazy"
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
    </Box>
  );
}
