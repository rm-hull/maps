import {
  Button,
  Dialog,
  ModalCloseButton,
  Tabs,
} from "@chakra-ui/react";
import { About } from "./About";
import { License } from "./License";
import { SettingsForm } from "./SettingsForm";
import { TracksForm } from "./TracksForm";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Dialog.Root open={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <Dialog.Positioner>
        <Dialog.Content>
          <Tabs.Root>
            <Dialog.Header>
              <Tabs.List>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                <Tabs.Trigger value="about">About</Tabs.Trigger>
                <Tabs.Trigger value="license">License</Tabs.Trigger>
                <Tabs.Trigger value="tracks">Tracks</Tabs.Trigger>
              </Tabs.List>
            </Dialog.Header>
            <ModalCloseButton />
            <Dialog.Body>
              <Tabs.Content value="settings">
                <SettingsForm />
              </Tabs.Content>
              <Tabs.Content value="about">
                <About />
              </Tabs.Content>
              <Tabs.Content value="license">
                <License />
              </Tabs.Content>
              <Tabs.Content value="tracks">
                <TracksForm />
              </Tabs.Content>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </Dialog.Footer>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
