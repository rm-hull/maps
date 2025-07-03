import { Box, Center, Image, Spinner, Tag } from "@chakra-ui/react";
import { LuCircleX, LuSkull } from "react-icons/lu";
import { ReactNode, useCallback, useEffect, useState } from "react";

export type Fugazi = { src: string; alt?: string; attribution?: ReactNode };
export type ImageLoader = string | (() => Promise<Fugazi>);

type FadeInImageProps = {
  src?: ImageLoader;
  alt: string;
  attribution?: ReactNode;
  height?: number;
};

export function FadeInImage({ src, alt, height, attribution, ...rest }: FadeInImageProps) {
  const [fugazi, setFugazi] = useState<Fugazi | undefined>(
    typeof src === "string" ? { src, alt, attribution } : undefined
  );
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof src === "function") {
      src()
        .then((resolvedUrl) => {
          setFugazi(resolvedUrl);
          setError(false);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [src]);

  const placeholder = useCallback(() => {
    if (error) {
      return <LuSkull color="tomato" size={72} />;
    } else if (!src) {
      return <LuCircleX color="gray" size={72} />;
    } else if (!isLoaded) {
      return <Spinner color="blue" size="lg" />;
    }
    return null;
  }, [src, isLoaded, error]);

  return (
    <Box position="relative" w="full" h={height} {...rest}>
      <Center position="absolute" top="0" left="0" w="100%" h="100%">
        {placeholder()}
      </Center>
      <Image
        src={fugazi?.src}
        alt={fugazi?.alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        width="full"
        height="full"
        objectFit="cover"
        transition="opacity 0.2s ease-in-out"
        opacity={isLoaded ? 1 : 0}
        loading="lazy"
      />
      {fugazi?.attribution && (
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
          {fugazi.attribution}
        </Tag>
      )}
    </Box>
  );
}
