import { useState } from "react";
import { Box, Center, Image, Spinner } from "@chakra-ui/react";
import { LuCircleX, LuSkull } from "react-icons/lu";

type FadeInImageProps = {
  src?: string;
  alt: string;
  height?: number;
};

export function FadeInImage({ src, alt, height, ...rest }: FadeInImageProps) {
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Box position="relative" w="full" h={height} {...rest}>
      {src && !isLoaded && (
        <Center position="absolute" top="0" left="0" w="100%" h="100%">
          <Spinner color="blue" size="lg" />
        </Center>
      )}
      {error && (
        <Center position="absolute" top="0" left="0" w="100%" h="100%">
          <LuSkull color="tomato" size={72} />
        </Center>
      )}
      {!src && (
        <Center position="absolute" top="0" left="0" w="100%" h="100%">
          <LuCircleX color="gray" size={72} />
        </Center>
      )}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        width="full"
        height="full"
        objectFit="cover"
        transition="opacity 0.2s ease-in-out"
        opacity={isLoaded ? 1 : 0}
        loading="lazy"
      />
    </Box>
  );
}
