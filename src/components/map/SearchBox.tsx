import {
  Box,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useControllableState,
  useDisclosure,
} from "@chakra-ui/react";
// import { useMapEvent } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { FiSearch } from "react-icons/fi";
import { type ChangeEvent, type JSX, useEffect } from "react";
import useFocus from "../../hooks/useFocus";
import { useKeyPressEvent } from "react-use";

export default function SearchBox(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputRef, setInputFocus] = useFocus();
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [value, setValue] = useControllableState({ defaultValue: "" });

  useEffect(() => {
    if (isOpen) {
      setInputFocus();
    }
  }, [isOpen, setInputFocus]);
  // useMapEvent("keydown", (event) => event.originalEvent.preventDefault());

  // useMapEvent("keydown", (event) => {
  //   console.log({ event: event.originalEvent });
  //   if (event.originalEvent.key == "/") {
  //     onOpen();
  //   // } else if (event.originalEvent.key === "Escape") {

  //   }
  //   event.originalEvent.
  //   // event.originalEvent.preventDefault();
  // });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleCancel = (e: { preventDefault: () => void }): void => {
    e.preventDefault();
    setValue("");
    onClose();
  };

  const handleSearch = (): void => {
    alert("Searching for: " + value);
    onClose();
  };

  useKeyPressEvent("/", onOpen);
  useKeyPressEvent("Enter", handleSearch);
  useKeyPressEvent("Escape", handleCancel);

  return (
    <Control position="bottomright" prepend>
      <Collapse in={isOpen} animate dir="left">
        <Box p="4px">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch />
            </InputLeftElement>
            <Input
              width={500}
              ref={inputRef}
              placeholder="Input place to search for, then press <enter>"
              bgColor={bg}
              // onBlur={onClose}
              value={value}
              onChange={handleChange}
            />
          </InputGroup>
        </Box>
      </Collapse>
    </Control>
  );
}
