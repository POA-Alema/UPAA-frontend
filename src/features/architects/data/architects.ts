import { architectsMock } from "../mocks/architect-mock";
import type { Architect } from "../types/architect";

type LocalizedField = {
  pt?: string;
};

type LandingPageRecord = {
  architectSection?: {
    imageURL?: string;
    imageSubtitle?: LocalizedField;
    title?: LocalizedField;
    subtitle?: LocalizedField;
    content?: LocalizedField;
    CTA?: {
      label?: LocalizedField;
      target?: string;
    };
  } | null;
} | null;

type LandingPageResponse = LandingPageRecord | LandingPageRecord[];

function getLandingPageRecord(
  payload: LandingPageResponse
): LandingPageRecord | null {
  return Array.isArray(payload) ? payload[0] ?? null : payload;
}

function extractSlug(target?: string): string | undefined {
  if (!target) {
    return undefined;
  }

  const segments = target.split("/").filter(Boolean);

  return segments.at(-1);
}

function mapFeaturedArchitect(
  payload: LandingPageResponse,
  fallback: Architect
): Architect | null {
  const page = getLandingPageRecord(payload);
  const section = page?.architectSection;
  const title = section?.title?.pt?.trim() || fallback.title;
  const bio = section?.content?.pt?.trim();

  if (!title || !bio) {
    return null;
  }

  const imageSrc = section?.imageURL?.trim();
  const imageCaption = section?.imageSubtitle?.pt?.trim();
  const primaryLabel = section?.CTA?.label?.pt?.trim();
  const primaryHref = section?.CTA?.target?.trim();

  return {
    ...fallback,
    slug: extractSlug(primaryHref) || fallback.slug,
    eyebrow: section?.subtitle?.pt?.trim() || fallback.eyebrow,
    title,
    bioSummary: section?.subtitle?.pt?.trim() || fallback.bioSummary,
    bio,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: imageCaption || title,
          caption: imageCaption || fallback.image?.caption,
        }
      : fallback.image,
    actions: {
      ...fallback.actions,
      primary:
        primaryLabel || primaryHref
          ? {
              label: primaryLabel || fallback.actions?.primary?.label || "",
              href: primaryHref || fallback.actions?.primary?.href,
            }
          : fallback.actions?.primary,
    },
  };
}

export async function listArchitects(): Promise<Architect[]> {
  // TODO: Replace mock data with CMS-backed source when the content layer becomes available.
  return architectsMock;
}

export async function getArchitectBySlug(slug: string): Promise<Architect | null> {
  const architects = await listArchitects();
  return architects.find((architect) => architect.slug === slug) ?? null;
}

export async function getFeaturedArchitect(): Promise<Architect | null> {
  const fallback = architectsMock[0] ?? null;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!fallback || !baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}/landing-page`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as LandingPageResponse;

    return mapFeaturedArchitect(payload, fallback) ?? fallback;
  } catch {
    return fallback;
  }
}
