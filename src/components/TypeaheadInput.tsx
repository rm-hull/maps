import { Input, Box, InputProps, mergeRefs } from "@chakra-ui/react";
import { useState, useEffect, useRef, useCallback, ChangeEvent, KeyboardEvent, RefObject } from "react";
import { useDebounce } from "react-use";
import { useErrorToast } from "@/hooks/useErrorToast";

type TypeaheadInputProps = InputProps & {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  suggestions?: string[];
  fetchSuggestions?: (prefix: string) => Promise<string[]>;
  ref?: RefObject<HTMLInputElement | null>;
  bgColor?: string;
  inset?: number | string;
};

export function TypeaheadInput({
  id = "typeahead-input",
  name,
  value = "",
  onChange,
  onKeyDown,
  suggestions,
  fetchSuggestions,
  bgColor,
  inset,
  ref: externalRef,
  ...inputProps
}: TypeaheadInputProps) {
  const [input, setInput] = useState(value);
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState<Error | undefined>();
  const [fetched, setFetched] = useState<string[]>([]);
  const internalRef = useRef<HTMLInputElement>(null);
  const mergedRef = mergeRefs(internalRef, externalRef);
  const [padding, setPadding] = useState({ left: "0px", right: "0px" });

  useEffect(() => {
    if (!internalRef.current) return;

    const updatePadding = () => {
      const el = internalRef.current!;
      const computed = window.getComputedStyle(el);
      setPadding({
        left: computed.paddingLeft,
        right: computed.paddingRight,
      });
    };

    updatePadding();

    const observer = new ResizeObserver(updatePadding);
    observer.observe(internalRef.current);
    return () => observer.disconnect();
  }, []);

  useErrorToast(id, "Failed to fetch suggestions", error);

  useDebounce(
    () => {
      if (fetchSuggestions && input.trim().length >= 3) {
        fetchSuggestions(input.trim())
          .then(setFetched)
          .catch((error) => {
            setError(error as Error);
            setFetched([]);
          });
      }
    },
    250,
    [input]
  );

  const allSuggestions = suggestions ?? fetched;

  const findBestMatch = useCallback(
    (prefix: string) => {
      if (!prefix) return "";
      const lowerPrefix = prefix.toLowerCase();
      const match = allSuggestions.find((s) => s.toLowerCase().startsWith(lowerPrefix));
      return match && match.length > prefix.length ? match : "";
    },
    [allSuggestions]
  );

  // Update suggestion whenever input or suggestions change
  useEffect(() => {
    queueMicrotask(() => setSuggestion(findBestMatch(input)));
  }, [input, allSuggestions, findBestMatch]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInput(val);
      onChange?.(e);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" && suggestion) {
        e.preventDefault();
        setInput(suggestion);
        onChange?.({ target: { value: suggestion } } as ChangeEvent<HTMLInputElement>);
        // Continue suggesting based on the new full text
        setTimeout(() => internalRef.current?.setSelectionRange(suggestion.length, suggestion.length), 0);
      } else {
        onKeyDown?.(e);
      }
    },
    [onChange, onKeyDown, suggestion, internalRef]
  );

  return (
    <Box position="relative" width="100%">
      <Box
        borderRadius={4}
        position="absolute"
        inset={inset}
        display="flex"
        alignItems="center"
        color="gray.400"
        fontFamily="inherit"
        fontSize="inherit"
        pointerEvents="none"
        whiteSpace="pre"
        pl={padding.left}
        pr={padding.right}
        bgColor={bgColor}
      >
        {input && suggestion && suggestion.startsWith(input) ? suggestion : ""}
      </Box>

      <Input
        ref={mergedRef}
        id={id}
        name={name}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fontFamily="inherit"
        fontSize="inherit"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        {...inputProps}
      />
    </Box>
  );
}
