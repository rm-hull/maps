import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useFocus } from "./useFocus";

describe("useFocus", () => {
  it("should return a ref and a focus function", () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>());

    const [ref, setFocus] = result.current;

    expect(ref).toBeDefined();
    expect(typeof setFocus).toBe("function");
  });

  it("should focus the input element when setFocus is called", () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>());

    const [ref, setFocus] = result.current;

    // Create a mock input element
    const mockInput = document.createElement("input");
    const focusSpy = vi.spyOn(mockInput, "focus");

    // Assign the mock element to the ref
    if (ref && "current" in ref) {
      (ref as React.MutableRefObject<HTMLInputElement>).current = mockInput;
    }

    // Call setFocus
    setFocus();

    // Verify focus was called
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it("should not throw error when ref.current is null", () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>());

    const [, setFocus] = result.current;

    // Should not throw
    expect(() => setFocus()).not.toThrow();
  });

  it("should maintain the same ref across renders", () => {
    const { result, rerender } = renderHook(() => useFocus<HTMLInputElement>());

    const [ref1] = result.current;
    rerender();
    const [ref2] = result.current;

    expect(ref1).toBe(ref2);
  });
});
