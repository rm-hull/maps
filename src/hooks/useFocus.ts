import { RefObject, useRef } from "react";

export function useFocus(): [RefObject<HTMLInputElement>, () => void] {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
}
