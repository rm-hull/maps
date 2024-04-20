import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogOverlay } from "@chakra-ui/react";
import { useRef, type JSX, type PropsWithChildren } from "react";

export default function Notice({ children }: PropsWithChildren<unknown>): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelRef = useRef<any>();

  return (
    <AlertDialog
      isOpen={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={() => null}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="xl" fontWeight="bold">
            {children}
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
