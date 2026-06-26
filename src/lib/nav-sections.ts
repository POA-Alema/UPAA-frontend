export const SECTION_IDS = ["intro", "immigration", "map-preview", "architects", "links"] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_KEYS: Record<SectionId, string> = {
  intro: "nav.section_intro",
  immigration: "nav.section_immigration",
  "map-preview": "nav.section_map",
  architects: "nav.section_architects",
  links: "nav.section_partners",
};
