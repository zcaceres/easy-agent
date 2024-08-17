import type { NormalizedName } from "../definitions";

/**
 * This helps us maintain string consistency across caches, agent registry, API requests etc.
 */
export default function NormalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, "-") as NormalizedName;
}
