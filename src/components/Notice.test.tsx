import { render, screen } from "../test/utils";
import { Notice } from "./Notice";

describe("Notice", () => {
  it("should render header as string", () => {
    render(<Notice header="Important Notice">This is a notice message</Notice>);

    expect(screen.getByText("Important Notice")).toBeInTheDocument();
    expect(screen.getByText("This is a notice message")).toBeInTheDocument();
  });

  it("should render header as JSX element", () => {
    render(
      <Notice header={<strong>Bold Header</strong>}>
        <p>Notice content</p>
      </Notice>
    );

    expect(screen.getByText("Bold Header")).toBeInTheDocument();
    expect(screen.getByText("Notice content")).toBeInTheDocument();
  });

  it("should render children correctly", () => {
    render(
      <Notice header="Header">
        <div>Child 1</div>
        <div>Child 2</div>
      </Notice>
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("should render with complex children", () => {
    render(
      <Notice header="Complex Notice">
        <p>Paragraph 1</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Notice>
    );

    expect(screen.getByText("Complex Notice")).toBeInTheDocument();
    expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
