import type { ImmigrationSection } from "../types/immigration";

export async function getImmigrationData(): Promise<ImmigrationSection | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/immigration-section`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data: ImmigrationSection = await response.json();

    if (!data || !data.content?.trim()) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}