import { type RefObject, useRef } from "react";

export function useFocus(): [RefObject<HTMLInputElement> | undefined, () => void] {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {
    htmlElRef.current?.focus();
  };

  return [htmlElRef as RefObject<HTMLInputElement>, setFocus];
}
