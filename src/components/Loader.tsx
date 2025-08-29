import { Progress } from "@chakra-ui/react";
import { type PropsWithChildren, Suspense } from "react";

export function Loader({ children }: PropsWithChildren) {
  return <Suspense fallback={<Progress size="xs" isIndeterminate />}>{children}</Suspense>;
}
