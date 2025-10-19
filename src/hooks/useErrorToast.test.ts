import { renderHook } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
import { useErrorToast } from "./useErrorToast";

// Mock the toaster
vi.mock("../components/ui/toaster.tsx", () => ({
  toaster: {
    create: vi.fn(),
  },
}));

describe("useErrorToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not show toast when error is null", async () => {
    const { toaster } = await import("../components/ui/toaster.tsx");

    renderHook(() => useErrorToast("test-id", "Test Title", null));

    expect(toaster.create).not.toHaveBeenCalled();
  });

  it("should not show toast when error is undefined", async () => {
    const { toaster } = await import("../components/ui/toaster.tsx");

    renderHook(() => useErrorToast("test-id", "Test Title", undefined));

    expect(toaster.create).not.toHaveBeenCalled();
  });

  it("should show toast when error is provided", async () => {
    const { toaster } = await import("../components/ui/toaster.tsx");
    const error = new Error("Test error message");

    renderHook(() => useErrorToast("test-id", "Test Title", error));

    expect(toaster.create).toHaveBeenCalledTimes(1);
    expect(toaster.create).toHaveBeenCalledWith({
      id: "test-id",
      title: "Test Title",
      description: "Test error message",
      type: "error",
      duration: 9000,
      closable: true,
    });
  });

  it("should update toast when error changes", async () => {
    const { toaster } = await import("../components/ui/toaster.tsx");
    const error1 = new Error("Error 1");
    const error2 = new Error("Error 2");

    const { rerender } = renderHook(({ error }) => useErrorToast("test-id", "Test Title", error), {
      initialProps: { error: error1 },
    });

    expect(toaster.create).toHaveBeenCalledTimes(1);
    expect(toaster.create).toHaveBeenLastCalledWith({
      id: "test-id",
      title: "Test Title",
      description: "Error 1",
      type: "error",
      duration: 9000,
      closable: true,
    });

    rerender({ error: error2 });

    expect(toaster.create).toHaveBeenCalledTimes(2);
    expect(toaster.create).toHaveBeenLastCalledWith({
      id: "test-id",
      title: "Test Title",
      description: "Error 2",
      type: "error",
      duration: 9000,
      closable: true,
    });
  });

  it("should use correct id and title", async () => {
    const { toaster } = await import("../components/ui/toaster.tsx");
    const error = new Error("Test error");

    renderHook(() => useErrorToast("custom-id", "Custom Title", error));

    expect(toaster.create).toHaveBeenCalledWith({
      id: "custom-id",
      title: "Custom Title",
      description: "Test error",
      type: "error",
      duration: 9000,
      closable: true,
    });
  });

  it("should not show toast when error becomes null", async () => {
    const { toaster } = await import("../components/ui/toaster.tsx");
    const error = new Error("Test error");

    const { rerender } = renderHook(
      ({ error }: { error: Error | null }) => useErrorToast("test-id", "Test Title", error),
      {
        initialProps: { error: error as Error | null },
      }
    );

    expect(toaster.create).toHaveBeenCalledTimes(1);

    rerender({ error: null });

    expect(toaster.create).toHaveBeenCalledTimes(1); // Should not be called again
  });
});
