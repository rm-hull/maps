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
import About from "./About";
import License from "./License";

interface SettingsModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

export default function SettingsModal({ isOpen, onCancel }: SettingsModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl" scrollBehavior="inside">
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
              <TabPanel>TODO</TabPanel>
              <TabPanel>
                <About />
              </TabPanel>
              <TabPanel>
                <License />
              </TabPanel>
            </TabPanels>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            Close
          </Button> */}
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </Tabs>
      </ModalContent>
    </Modal>
  );
}
