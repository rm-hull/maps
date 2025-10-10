import { vi } from "vitest";
import { App } from "./App";
import { render, screen } from "./test/utils";

// Mock the pages
vi.mock("./pages/Home", () => ({
  Home: () => <div>Home Page</div>,
}));

vi.mock("./pages/Search", () => ({
  Search: () => <div>Search Page</div>,
}));

describe("App", () => {
  it("should render without crashing", () => {
    render(<App />);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("should render Home component for root path", () => {
    render(<App />);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
