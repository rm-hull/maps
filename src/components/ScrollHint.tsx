import { Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoChevronDownCircleOutline } from "react-icons/io5";

const MotionIcon = motion(Icon);

export default function ScrollHint() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // If user is NOT at bottom, show hint
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      setShowHint(!atBottom);
    }

    handleScroll(); // run on mount
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!showHint) return null;

  return (
    <MotionIcon
      as={IoChevronDownCircleOutline}
      boxSize={8}
      color="gray.500"
      position="fixed"
      bottom="6"
      left="50%"
      transform="translateX(-50%)"
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    />
  );
}
