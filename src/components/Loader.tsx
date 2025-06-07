import { type PropsWithChildren, Suspense } from "react";
import { Progress } from "@chakra-ui/react";

export function Loader({ children }: PropsWithChildren) {
  return <Suspense fallback={<Progress size="xs" isIndeterminate />}>{children}</Suspense>;
}
