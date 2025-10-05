import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

const localStorage = atom<Record<string, unknown> | undefined>(undefined);

type UseLocalStorageReturnType<T> = {
  value?: T;
  setValue: (value?: T) => void;
  isLoading: boolean;
};

function readValue<T>(key: string): T | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const item = window.localStorage.getItem(key);
  return item === null || item === undefined ? undefined : (JSON.parse(item) as T);
}

function setValue<T>(key: string, value?: T) {
  try {
    if (value === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }

    window.dispatchEvent(new Event("local-storage"));
  } catch (error) {
    console.error(`Error setting localStorage key “${key}”:`, error);
  }
}

export const useLocalStorage = <T>(key: string): UseLocalStorageReturnType<T> => {
  const [isLoading, setIsLoading] = useState(true);
  const [storedValue, setStoredValue] = useAtom(localStorage);

  useEffect(() => {
    setStoredValue((prev) => ({ ...(prev ?? {}), [key]: readValue(key) }));

    const handleStorageChange = (): void => {
      setStoredValue((prev) => ({ ...(prev ?? {}), [key]: readValue(key) }));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    setIsLoading(false);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [key, setStoredValue]);

  return {
    value: storedValue?.[key] as T,
    setValue: useCallback(
      (value?: T) => {
        setValue(key, value);
      },
      [key]
    ),
    isLoading,
  };
};
