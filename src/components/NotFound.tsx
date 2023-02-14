import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Link,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Link as BrowserLink } from "react-router-dom";
import latLng from "../lat-long.json";

type NotFoundProps = {
  town: string;
};

export default function NotFound({ town }: NotFoundProps) {
  const matches = Object.keys(latLng).filter((t) => t.includes(town));
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
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Nearest matches
          </AlertDialogHeader>

          <AlertDialogBody>
            <List>
              {matches.map((match) => (
                <ListItem key={match}>
                  <Link as={BrowserLink} to={`/${match}`}>
                    {match}
                  </Link>
                </ListItem>
              ))}
            </List>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
