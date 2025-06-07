import { Progress } from "@chakra-ui/react";
import { Suspense, type PropsWithChildren } from "react";

export function Loader({ children }: PropsWithChildren) {
  return <Suspense fallback={<Progress size="xs" isIndeterminate />}>{children}</Suspense>;
}
