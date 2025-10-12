import { render } from "../../../test/utils";
import { SearchIcon } from "./SearchIcon";

describe("SearchIcon", () => {
  it("should render icon for City", () => {
    const { container } = render(<SearchIcon localType="City" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon for Town", () => {
    const { container } = render(<SearchIcon localType="Town" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon for Postcode", () => {
    const { container } = render(<SearchIcon localType="Postcode" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon for Railway Station", () => {
    const { container } = render(<SearchIcon localType="Railway Station" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon for Hospital", () => {
    const { container } = render(<SearchIcon localType="Hospital" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon for Hill Or Mountain", () => {
    const { container } = render(<SearchIcon localType="Hill Or Mountain" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon for Airport", () => {
    const { container } = render(<SearchIcon localType="Airport" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon for Beach", () => {
    const { container } = render(<SearchIcon localType="Beach" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render default globe icon for unknown type", () => {
    const { container } = render(<SearchIcon localType="Unknown Type" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should handle localType with comma-separated values", () => {
    const { container } = render(<SearchIcon localType="City, Town, Village" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render icon with correct size", () => {
    const { container } = render(<SearchIcon localType="City" />);
    const icon = container.querySelector("svg");
    expect(icon).toHaveAttribute("width", "16");
    expect(icon).toHaveAttribute("height", "16");
  });
});
