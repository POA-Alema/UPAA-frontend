import { NextResponse } from "next/server";
import path from "node:path";
import { stat } from "node:fs/promises";
import { getPublicRuntimeConfig } from "@/lib/config";
import {
  mapBackendBuildingsToMapBuildings,
  type Building,
  type BackendBuilding,
} from "@/features/map/utils/map-buildings";

const API_TIMEOUT_MS = 2_000;
const BACKEND_LANG: Record<string, string> = {
  pt: "pt",
  en: "en",
  de: "de",
};

function resolveBuildingsEndpoints(lang: string): string[] {
  const backendLang = BACKEND_LANG[lang] ?? "pt";
  return [`/buildings/map?lang=${backendLang}`, "/constructions"];
}

async function isValidLocalImage(src: string): Promise<boolean> {
  try {
    const pathname = decodeURIComponent(new URL(src, "http://localhost").pathname);
    const publicDir = path.resolve(process.cwd(), "public");
    const imagePath = path.resolve(publicDir, pathname.replace(/^\/+/, ""));

    if (!imagePath.startsWith(publicDir)) {
      return false;
    }

    const file = await stat(imagePath);
    return file.isFile();
  } catch {
    return false;
  }
}

async function isValidRemoteImage(src: string): Promise<boolean> {
  try {
    const response = await fetch(src, {
      method: "HEAD",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function isValidImage(src: string): Promise<boolean> {
  return src.startsWith("http://") || src.startsWith("https://")
    ? isValidRemoteImage(src)
    : isValidLocalImage(src);
}
async function sanitizeAttachments(buildings: Building[]): Promise<Building[]> {
  return Promise.all(
    buildings.map(async (building) => {
      const attachments = building.attachments ?? [];
      const validity = await Promise.all(attachments.map((a) => isValidImage(a.src)));
      return {
        ...building,
        attachments: attachments.filter((_, index) => validity[index]),
      };
    }),
  );
}

async function fetchMapBuildings(lang: string): Promise<BackendBuilding[]> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, "");

  for (const endpoint of resolveBuildingsEndpoints(lang)) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!response.ok) {
      continue;
    }

    const payload = await response.json();

    if (!Array.isArray(payload)) {
      continue;
    }

    return payload as BackendBuilding[];
  }

  throw new Error("Failed to load map buildings");
}

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") ?? "pt";
  try {
    const mapBuildings = await fetchMapBuildings(lang);
    const buildings = mapBackendBuildingsToMapBuildings(mapBuildings, lang);

    if (buildings.length === 0) {
      throw new Error("Map buildings payload is empty");
    }

    return NextResponse.json(await sanitizeAttachments(buildings));
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load map buildings",
      },
      { status: 502 },
    );
  }
}
