import { Box, HStack, Text, VStack } from "@chakra-ui/react";

type ScaleProps = {
  label: string;
  values: { value?: string; color: string }[];
};

export function Scale({ label, values }: ScaleProps) {
  return (
    <HStack color="gray.600">
      {label}
      <HStack gap={0}>
        {values.map(({ color, value }, index) => (
          <VStack key={index} gap={0}>
            <Box
              borderColor="gray.600"
              borderWidth={1}
              backgroundColor={color}
              margin="-1px"
              width="12px"
              height="8px"
            />
            <Text color="gray.600" fontSize="7.5px" height={3}>
              {value}
            </Text>
          </VStack>
        ))}
      </HStack>
    </HStack>
  );
}
