import { Button } from "@chakra-ui/react";
import { MouseEventHandler, PropsWithChildren } from "react";
import { useColorModeValue } from "./ui/color-mode";
import { Tooltip } from "./ui/tooltip";

interface ControlButtonProps {
  color?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
}

export function ControlButton({
  onClick,
  onMouseOver,
  onMouseEnter,
  color,
  children,
  tooltip,
}: PropsWithChildren<ControlButtonProps>) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.400");
  const defaultColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  const button = (
    <Button
      background={bgColor}
      variant="outline"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseEnter={onMouseEnter}
      padding={0}
      borderWidth={2}
      borderColor={borderColor}
      fontSize="1.5rem"
      color={color ?? defaultColor}
      borderRadius={5}
      size="lg"
    >
      {children}
    </Button>
  );

  return tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button;
}
