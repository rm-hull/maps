import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { type JSX } from "react";
import { About } from "./About";
import { License } from "./License";
import { SettingsForm } from "./SettingsForm";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <Tabs>
          <ModalHeader>
            <TabList>
              <Tab>Settings</Tab>
              <Tab>About</Tab>
              <Tab>License</Tab>
            </TabList>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TabPanels>
              <TabPanel>
                <SettingsForm />
              </TabPanel>
              <TabPanel>
                <About />
              </TabPanel>
              <TabPanel>
                <License />
              </TabPanel>
            </TabPanels>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </Tabs>
      </ModalContent>
    </Modal>
  );
}
