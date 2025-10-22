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

  it("should return original stack immediately", async () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at test.js:1:1";

    const { result } = renderHook(() => useReadableStack(error));

    await waitFor(() => {
      expect(result.current.stack).toBe(error.stack);
    });
  });

  it("should set loading to true while decoding", async () => {
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

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
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

    vi.mocked(global.fetch).mockResolvedValue({ ok: false } as Response);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useReadableStack(error));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.stack).toBe(error.stack);
    });

    consoleErrorSpy.mockRestore();
  });

  it("should decode stack trace successfully", async () => {
    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at (http://example.com/app.js:1:1)";

    const sourceMapData = {
      version: 3,
      sources: ["app.js"],
      names: ["test"],
      mappings: "AAAA,IAAIA,KAAK",
      file: "app.js",
      sourcesContent: ["const test = () => {};"],
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(sourceMapData),
    } as Response);

    const { result } = renderHook(() => useReadableStack(error));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.stack).toContain("app.js:1:");
    });
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

  it("should update when error changes", async () => {
    const error1 = new Error("Error 1");
    error1.stack = "Stack 1";

    const error2 = new Error("Error 2");
    error2.stack = "Stack 2";

    const { result, rerender } = renderHook(({ error }) => useReadableStack(error), {
      initialProps: { error: error1 },
    });

    await waitFor(() => {
      expect(result.current.stack).toBe("Stack 1");
    });

    rerender({ error: error2 });

    await waitFor(() => {
      expect(result.current.stack).toBe("Stack 2");
    });
  });
});
