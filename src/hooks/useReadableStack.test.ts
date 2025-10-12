import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
import { useReadableStack } from "./useReadableStack";

describe("useReadableStack", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should return undefined stack for null error", () => {
    const { result } = renderHook(() => useReadableStack(null));

    expect(result.current.stack).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it("should return original stack immediately", () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at test.js:1:1";

    const { result } = renderHook(() => useReadableStack(error));

    expect(result.current.stack).toBe(error.stack);
  });

  it("should set loading to true while decoding", () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at (http://example.com/app.js:1:1)";

    // Mock fetch to never resolve
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves
        })
    );

    const { result } = renderHook(() => useReadableStack(error));

    expect(result.current.loading).toBe(true);
  });

  it("should handle error without stack gracefully", () => {
    const error = new Error("Test error");
    delete error.stack;

    const { result } = renderHook(() => useReadableStack(error));

    expect(result.current.stack).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it("should handle source map fetch failure", async () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at (http://example.com/app.js:1:1)";

    vi.mocked(global.fetch).mockRejectedValue(new Error("Fetch failed"));

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useReadableStack(error));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stack).toBe(error.stack);

    consoleErrorSpy.mockRestore();
  });

  it("should cleanup on unmount", () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at (http://example.com/app.js:1:1)";

    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves
        })
    );

    const { unmount } = renderHook(() => useReadableStack(error));

    // Should not throw
    expect(() => unmount()).not.toThrow();
  });

  it("should update when error changes", () => {
    const error1 = new Error("Error 1");
    error1.stack = "Stack 1";

    const error2 = new Error("Error 2");
    error2.stack = "Stack 2";

    const { result, rerender } = renderHook(({ error }) => useReadableStack(error), {
      initialProps: { error: error1 },
    });

    expect(result.current.stack).toBe("Stack 1");

    rerender({ error: error2 });

    expect(result.current.stack).toBe("Stack 2");
  });
});
