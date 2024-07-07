import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useRef, type JSX, type PropsWithChildren } from "react";

interface NoticeProps {
  header: JSX.Element | string;
}

export function Notice({ header, children }: PropsWithChildren<NoticeProps>): JSX.Element {
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
            {header}
          </AlertDialogHeader>
          {children !== undefined && <AlertDialogBody>{children}</AlertDialogBody>}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
