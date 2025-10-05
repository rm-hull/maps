import {
  Button,
  Dialog,
  Portal,
  // ModalCloseButton,
  Tabs,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { ColorModeButton } from "../ui/color-mode";
import { About } from "./About";
import { License } from "./License";
import { SettingsForm } from "./SettingsForm";
import { TracksForm } from "./TracksForm";

export function SettingsDialog({ children }: PropsWithChildren) {
  return (
    <Dialog.Root size="lg" scrollBehavior="inside">
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Tabs.Root colorPalette="blue" defaultValue="settings">
              <Dialog.Header>
                <Dialog.Title width="100%" display="flex">
                  <Tabs.List width="100%">
                    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                    <Tabs.Trigger value="about">About</Tabs.Trigger>
                    <Tabs.Trigger value="license">MIT License</Tabs.Trigger>
                    <Tabs.Trigger value="tracks">Tracks</Tabs.Trigger>
                  </Tabs.List>
                  <ColorModeButton position="absolute" right={6} />
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Tabs.Content value="settings">
                  <SettingsForm />
                </Tabs.Content>
                <Tabs.Content value="about">
                  <About />
                </Tabs.Content>
                <Tabs.Content value="license">
                  <License showHeading={false} />
                </Tabs.Content>
                <Tabs.Content value="tracks">
                  <TracksForm />
                </Tabs.Content>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="subtle">Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
