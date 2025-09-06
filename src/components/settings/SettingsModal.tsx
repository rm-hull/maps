import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <Tabs.Root>
          <ModalHeader>
            <Tabs.List>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              <Tabs.Trigger value="about">About</Tabs.Trigger>
              <Tabs.Trigger value="license">License</Tabs.Trigger>
              <Tabs.Trigger value="tracks">Tracks</Tabs.Trigger>
            </Tabs.List>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </Tabs.Root>
      </ModalContent>
    </Modal>
  );
}
