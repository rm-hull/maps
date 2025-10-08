import { vi } from "vitest";
import { render, screen } from "../test/utils";
import { ErrorFallback } from "./ErrorFallback";

// Mock the useReadableStack hook
vi.mock("@/hooks/useReadableStack", () => ({
  useReadableStack: vi.fn((error: Error) => ({
    stack: error.stack || "Mock stack trace",
    loading: false,
  })),
}));

describe("ErrorFallback", () => {
  it("should render error message", () => {
    const error = new Error("Test error message");

    render(<ErrorFallback error={error} />);

    expect(screen.getByText("Something went wrong:")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("should render stack trace heading", () => {
    const error = new Error("Test error");

    render(<ErrorFallback error={error} />);

    expect(screen.getByText(/Stack trace/i)).toBeInTheDocument();
  });

  it("should display stack trace", () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at test.js:1:1";

    render(<ErrorFallback error={error} />);

    // Check that the stack trace is displayed (it will show actual stack, not "Mock stack trace" text)
    expect(screen.getByText(/test\.js:1:1/)).toBeInTheDocument();
  });

  it("should show loading indicator when stack is being resolved", async () => {
    const useReadableStackModule = await import("@/hooks/useReadableStack");
    const { useReadableStack } = useReadableStackModule;

    vi.mocked(useReadableStack).mockReturnValueOnce({
      stack: "Loading...",
      loading: true,
    });

    const error = new Error("Test error");

    render(<ErrorFallback error={error} />);

    expect(screen.getByText(/resolving source maps/i)).toBeInTheDocument();
  });

  it("should not show loading indicator when stack is resolved", () => {
    const error = new Error("Test error");

    render(<ErrorFallback error={error} />);

    expect(screen.queryByText(/resolving source maps/i)).not.toBeInTheDocument();
  });
});
