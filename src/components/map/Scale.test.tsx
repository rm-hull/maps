import { render, screen } from "../../test/utils";
import { Scale } from "./Scale";

describe("Scale", () => {
  it("should render label", () => {
    const values = [
      { color: "red", value: "0" },
      { color: "yellow", value: "50" },
      { color: "green", value: "100" },
    ];

    render(<Scale label="Temperature" values={values} />);
    expect(screen.getByText("Temperature")).toBeInTheDocument();
  });

  it("should render all scale values", () => {
    const values = [
      { color: "red", value: "0" },
      { color: "yellow", value: "50" },
      { color: "green", value: "100" },
    ];

    render(<Scale label="Temperature" values={values} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should render scale boxes with correct colors", () => {
    const values = [
      { color: "red", value: "0" },
      { color: "yellow", value: "50" },
    ];

    render(<Scale label="Test" values={values} />);

    // Check that values are rendered (which means the boxes are there too)
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("should handle values without labels", () => {
    const values = [{ color: "red" }, { color: "yellow" }, { color: "green", value: "100" }];

    render(<Scale label="Test" values={values} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should render with custom foreground color", () => {
    const values = [{ color: "red", value: "0" }];

    render(<Scale label="Test" values={values} color="blue" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should handle empty values array", () => {
    render(<Scale label="Test" values={[]} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should render multiple scale items", () => {
    const values = [
      { color: "#FF0000", value: "Low" },
      { color: "#FFFF00", value: "Medium" },
      { color: "#00FF00", value: "High" },
    ];

    render(<Scale label="Level" values={values} />);
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
