import { useCallback, useState } from "react";
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
