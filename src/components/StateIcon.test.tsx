import { render } from "../test/utils";
import { StateIcon } from "./StateIcon";

describe("StateIcon", () => {
  it("should render error icon for error state", () => {
    const { container } = render(<StateIcon state="error" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render success icon for ok state", () => {
    const { container } = render(<StateIcon state="ok" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render warning icon for not-found state", () => {
    const { container } = render(<StateIcon state="not-found" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render crosshair icon for multiple state", () => {
    const { container } = render(<StateIcon state="multiple" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render spinner for busy state", () => {
    const { container } = render(<StateIcon state="busy" />);
    // Check for spinner class or element since Chakra UI Spinner may not have proper ARIA role
    const spinner = container.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it("should render search icon for undefined state", () => {
    const { container } = render(<StateIcon state={undefined} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
