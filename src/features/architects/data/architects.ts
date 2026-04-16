import { architectsMock } from "../mocks/architect-mock";
import type { Architect } from "../types/architect";

export async function listArchitects(): Promise<Architect[]> {
  // TODO: Replace mock data with CMS-backed source when the content layer becomes available.
  return architectsMock;
}

export async function getArchitectBySlug(slug: string): Promise<Architect | null> {
  const architects = await listArchitects();
  return architects.find((architect) => architect.slug === slug) ?? null;
}

export async function getFeaturedArchitect(): Promise<Architect | null> {
  const architects = await listArchitects();
  return architects[0] ?? null;
}
