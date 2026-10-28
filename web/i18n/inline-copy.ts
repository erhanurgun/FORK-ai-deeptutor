import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { normalizeLanguage } from "./languages";

/** UI copy written next to its component as `{ en, zh }` instead of in the catalogs. */
export type InlineCopy = { en: string; zh: string };

/**
 * English and Chinese render the inline text exactly as before. Other
 * languages look the English text up as a catalog key and fall back to it,
 * the way data-driven labels already resolve through `t(item.label)`.
 */
export function inlineCopy(
  copy: InlineCopy,
  language: string | undefined,
  t: (key: string) => string,
): string {
  const code = normalizeLanguage(language);
  if (code === "zh") return copy.zh;
  if (code === "en") return copy.en;
  return t(copy.en);
}

export function useInlineCopy(): (copy: InlineCopy) => string {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  return useCallback((copy: InlineCopy) => inlineCopy(copy, language, t), [language, t]);
}
