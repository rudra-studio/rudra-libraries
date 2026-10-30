export const landingPageTokens = {
  contentMaxWidth: "72rem",
  sectionPadding: "clamp(3rem, 8vw, 7rem)",
  cardRadius: "1.125rem",
} as const;

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
