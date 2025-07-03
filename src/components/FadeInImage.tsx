import { Box, Center, Image, Spinner, Tag } from "@chakra-ui/react";
import { LuCircleX, LuSkull } from "react-icons/lu";
import { ReactNode, useCallback, useEffect, useState } from "react";

type ImageDetails = { src?: string; alt?: string; attribution?: ReactNode };

export type ImageLoaderFn = () => Promise<ImageDetails>;

interface FadeInImageProps extends ImageDetails {
  loader?: ImageLoaderFn;
  height?: number;
}

export function FadeInImage({ loader, src, alt, height, attribution, ...rest }: FadeInImageProps) {
  const [imageDetails, setImageDetails] = useState<ImageDetails>({ src, alt, attribution });
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setImageDetails({ src, alt, attribution });
    setLoaded(false);
    setError(false);
    if (loader) {
      loader()
        .then((resolvedUrl) => {
          if (isMounted) {
            setImageDetails(resolvedUrl);
            setLoaded(true);
          }
          return;
        })
        .catch(() => {
          if (isMounted) {
            setError(true);
          }
        });
    } else if (!src) {
      // If there is no loader and no src, we can consider it "loaded" immediately.
      setLoaded(true);
    }

    return () => {
      isMounted = false;
    };
  }, [loader, src, alt, attribution]);

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

  return (
    <Box position="relative" w="full" h={height} {...rest}>
      <Center position="absolute" top="0" left="0" w="100%" h="100%">
        {placeholder()}
      </Center>
      <Image
        src={imageDetails?.src}
        alt={imageDetails?.alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        width="full"
        height="full"
        objectFit="cover"
        transition="opacity 0.2s ease-in-out"
        opacity={isLoaded ? 1 : 0}
        loading="lazy"
      />
      {imageDetails?.attribution && (
        <Tag
          position="absolute"
          bottom={0}
          right={0}
          m={1}
          p={0.5}
          variant="subtle"
          size="xs"
          fontSize="xs"
          colorScheme="gray"
          opacity={0.5}
        >
          {imageDetails.attribution}
        </Tag>
      )}
    </Box>
  );
}
