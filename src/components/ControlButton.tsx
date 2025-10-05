import { Button } from "@chakra-ui/react";
import { MouseEventHandler, PropsWithChildren } from "react";
import { useColorModeValue } from "./ui/color-mode";
import { Tooltip } from "./ui/tooltip";

interface ControlButtonProps {
  color?: string | false;
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
  const bgColor = useColorModeValue("white", "var(--chakra-colors-gray-800)");
  const borderColor = useColorModeValue("rgba(0,0,0,0.2)", "rgba(255,255,255,0.2)");
  const defaultColor = useColorModeValue("rgba(0,0,0,0.5)", "rgba(255,255,255,0.5)");

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
      color={color || defaultColor}
      borderRadius={5}
      size="lg"
    >
      {children}
    </Button>
  );

  return tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button;
}
