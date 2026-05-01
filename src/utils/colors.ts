/**
 * Hashes a string into a 32-bit unsigned integer using the FNV-1a algorithm.
 * This provides good entropy and distribution for short strings like bus numbers.
 *
 * @param str The string to hash.
 * @returns A positive 32-bit integer.
 */
export function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Returns dynamic CSS styles for a badge based on the hash of the provided string.
 * Uses HSL colors to ensure consistent saturation and lightness across different hues,
 * providing appropriate values for both light and dark themes.
 *
 * @param str The string to map to a color.
 * @returns An object containing style properties for Chakra UI.
 */
export function getBadgeStyles(str: string) {
  const normalized = str?.trim() ?? "";
  if (!normalized) {
    return { colorPalette: "gray" };
  }

  const hash = hashString(normalized);
  const hue = hash % 360;

  return {
    // Light mode styles
    backgroundColor: `hsl(${hue}, 80%, 92%)`,
    color: `hsl(${hue}, 80%, 25%)`,
    borderColor: `hsl(${hue}, 80%, 80%)`,
    borderWidth: "1px",
    // Dark mode styles via Chakra's _dark pseudo-selector
    _dark: {
      backgroundColor: `hsl(${hue}, 50%, 15%)`,
      color: `hsl(${hue}, 50%, 85%)`,
      borderColor: `hsl(${hue}, 50%, 25%)`,
    },
  };
}
