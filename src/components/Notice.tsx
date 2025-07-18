import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { type JSX, type PropsWithChildren, useRef } from "react";

interface NoticeProps {
  header: JSX.Element | string;
}

export function Notice({ header, children }: PropsWithChildren<NoticeProps>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelRef = useRef<any>(null);

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
            {header}
          </AlertDialogHeader>
          {children !== undefined && <AlertDialogBody>{children}</AlertDialogBody>}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
