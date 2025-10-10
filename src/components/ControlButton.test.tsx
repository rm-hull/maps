import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { render, screen } from "../test/utils";
import { ControlButton } from "./ControlButton";

describe("ControlButton", () => {
  it("should render children correctly", () => {
    render(<ControlButton>Click Me</ControlButton>);

    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ControlButton onClick={handleClick}>Click Me</ControlButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should call onMouseOver handler when mouse is over", async () => {
    const user = userEvent.setup();
    const handleMouseOver = vi.fn();

    render(<ControlButton onMouseOver={handleMouseOver}>Hover Me</ControlButton>);

    const button = screen.getByRole("button", { name: /hover me/i });
    await user.hover(button);

    expect(handleMouseOver).toHaveBeenCalled();
  });

  it("should call onMouseEnter handler when mouse enters", async () => {
    const user = userEvent.setup();
    const handleMouseEnter = vi.fn();

    render(<ControlButton onMouseEnter={handleMouseEnter}>Enter Me</ControlButton>);

    const button = screen.getByRole("button", { name: /enter me/i });
    await user.hover(button);

    expect(handleMouseEnter).toHaveBeenCalled();
  });

  it("should apply custom color when provided", () => {
    render(<ControlButton color="red">Colored Button</ControlButton>);

    const button = screen.getByRole("button", { name: /colored button/i });
    expect(button).toHaveStyle({ color: "red" });
  });
  });

  it("should render with tooltip when provided", () => {
    render(<ControlButton tooltip="This is a tooltip">Button</ControlButton>);

    const button = screen.getByRole("button", { name: /button/i });
    expect(button).toBeInTheDocument();
  });

  it("should render without tooltip when not provided", () => {
    render(<ControlButton>Button</ControlButton>);

    const button = screen.getByRole("button", { name: /button/i });
    expect(button).toBeInTheDocument();
  });

  it("should handle multiple event handlers", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleMouseOver = vi.fn();
    const handleMouseEnter = vi.fn();

    render(
      <ControlButton onClick={handleClick} onMouseOver={handleMouseOver} onMouseEnter={handleMouseEnter}>
        Multi Event Button
      </ControlButton>
    );

    const button = screen.getByRole("button", { name: /multi event button/i });

    await user.hover(button);
    expect(handleMouseOver).toHaveBeenCalled();
    expect(handleMouseEnter).toHaveBeenCalled();

    await user.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
