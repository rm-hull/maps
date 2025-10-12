import { act, renderHook } from "@testing-library/react";
import { useMousePosition } from "./useMousePosition";

describe("useMousePosition", () => {
  it("should initialize with position at (0, 0)", () => {
    const { result } = renderHook(() => useMousePosition());

    expect(result.current.mousePosition).toEqual({ x: 0, y: 0 });
  });

  it("should update mouse position when updateMousePosition is called", () => {
    const { result } = renderHook(() => useMousePosition());

    const mockEvent = {
      clientX: 100,
      clientY: 200,
    } as MouseEvent;

    act(() => {
      result.current.updateMousePosition(mockEvent);
    });

    expect(result.current.mousePosition).toEqual({ x: 100, y: 200 });
  });

  it("should update multiple times correctly", () => {
    const { result } = renderHook(() => useMousePosition());

    const event1 = { clientX: 50, clientY: 75 } as MouseEvent;
    const event2 = { clientX: 150, clientY: 250 } as MouseEvent;

    act(() => {
      result.current.updateMousePosition(event1);
    });

    expect(result.current.mousePosition).toEqual({ x: 50, y: 75 });

    act(() => {
      result.current.updateMousePosition(event2);
    });

    expect(result.current.mousePosition).toEqual({ x: 150, y: 250 });
  });

  it("should maintain the same updateMousePosition function reference", () => {
    const { result, rerender } = renderHook(() => useMousePosition());

    const updateFn1 = result.current.updateMousePosition;
    rerender();
    const updateFn2 = result.current.updateMousePosition;

    expect(updateFn1).toBe(updateFn2);
  });

  it("should handle negative coordinates", () => {
    const { result } = renderHook(() => useMousePosition());

    const mockEvent = {
      clientX: -10,
      clientY: -20,
    } as MouseEvent;

    act(() => {
      result.current.updateMousePosition(mockEvent);
    });

    expect(result.current.mousePosition).toEqual({ x: -10, y: -20 });
  });

  it("should handle zero coordinates", () => {
    const { result } = renderHook(() => useMousePosition());

    const mockEvent = {
      clientX: 0,
      clientY: 0,
    } as MouseEvent;

    act(() => {
      result.current.updateMousePosition(mockEvent);
    });

    expect(result.current.mousePosition).toEqual({ x: 0, y: 0 });
  });
});
