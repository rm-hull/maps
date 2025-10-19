import { Progress } from "@chakra-ui/react";
import { type PropsWithChildren, Suspense } from "react";

export function Loader({ children }: PropsWithChildren) {
  return (
    <Suspense
      fallback={
        <Progress.Root size="xs" value={null}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      }
    >
      {children}
    </Suspense>
  );
}
