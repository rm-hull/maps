import { useEffect } from "react";
import { toaster } from "../components/ui/toaster";

export function useErrorToast(id: string, title: string, error: Error | null | undefined) {
  useEffect(() => {
    if (error) {
      queueMicrotask(() =>
        toaster.create({
          id,
          title,
          description: error.message,
          type: "error",
          duration: 9000,
          closable: true,
        })
      );
    }
  }, [id, title, error]);
}
