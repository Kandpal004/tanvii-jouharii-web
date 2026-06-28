import { useMemo } from "react";
import content from "../data/content";

/**
 * useContent — returns a slice of the content object.
 * Mirrors the old API shape ({ data, loading, error })
 * so no other files need to change.
 *
 * endpoint examples:
 *   "/content"              → full content object
 *   "/content/hero"         → content.hero
 *   "/content/about"        → content.about
 *   "/content/gallery"      → content.about.gallery
 *   "/content/pillars"      → content.pillars
 *   "/content/timeline"     → content.timeline
 *   "/content/brand-statement" → content.brandStatement
 */
export function useContent(endpoint = "/content") {
  const data = useMemo(() => {
    if (endpoint === "/content") return content;
    if (endpoint === "/content/hero") return content.hero;
    if (endpoint === "/content/about") return content.about;
    if (endpoint === "/content/gallery") return content.about.gallery;
    if (endpoint === "/content/pillars") return content.pillars;
    if (endpoint === "/content/timeline") return content.timeline;
    if (endpoint === "/content/brand-statement") return content.brandStatement;
    return null;
  }, [endpoint]);

  return { data, loading: false, error: null };
}
