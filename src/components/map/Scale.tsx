import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";

type ScaleProps = {
  label: string;
  width?: number;
  values: { value?: string; color: string }[];
};

export function Scale({ label, values, width = 12 }: ScaleProps) {
  const fgColor = useColorModeValue("gray.600", "gray.300");
  return (
    <HStack color={fgColor}>
      {label}
      <HStack gap={0}>
        {values.map(({ color, value }, index) => (
          <VStack key={index} gap={0}>
            <Box
              borderColor={fgColor}
              borderWidth={1}
              backgroundColor={color}
              margin="-1px"
              width={`${width}px`}
              height="8px"
            />
            <Text fontSize="7.5px" height={3}>
              {value}
            </Text>
          </VStack>
        ))}
      </HStack>
    </HStack>
  );
}
