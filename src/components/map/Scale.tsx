import { Box, HStack, Text, VStack } from "@chakra-ui/react";

type ScaleProps = {
  label: string;
  values: { value?: string; color: string }[];
  color?: string;
};

export function Scale({ label, values, color: fgColor = "gray.600" }: ScaleProps) {
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
              width="12px"
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
