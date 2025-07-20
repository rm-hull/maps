import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

export function useErrorToast(id: string, title: string, error: Error | null | undefined) {
  const toast = useToast();
  useEffect(() => {
    if (error) {
      toast({
        id,
        title,
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [id, title, error, toast]);
}
