import { NextResponse } from "next/server";
import path from "node:path";
import { stat } from "node:fs/promises";
import { getPublicRuntimeConfig } from "@/lib/config";
import { mapBuildingsMock } from "@/features/map/mocks/map-buildings-mock";
import {
  mapBackendBuildingsToMapBuildings,
  type Building,
  type BackendBuilding,
} from "@/features/map/utils/map-buildings";

const API_TIMEOUT_MS = 2_000;
const BUILDINGS_ENDPOINT_CANDIDATES = [
  "/buildings/map?lang=pt",
  "/constructions",
] as const;

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

async function hasValidImage(buildings: Building[]): Promise<boolean> {
  const imageSources = buildings.flatMap((building) =>
    (building.attachments ?? []).map((attachment) => attachment.src),
  );

  for (const src of imageSources) {
    const valid = src.startsWith("http://") || src.startsWith("https://")
      ? await isValidRemoteImage(src)
      : await isValidLocalImage(src);

    if (valid) {
      return true;
    }
  }

  return false;
}

async function fetchMapBuildings(): Promise<BackendBuilding[]> {
  const { apiUrl } = getPublicRuntimeConfig();
  const baseUrl = apiUrl.replace(/\/$/, "");

  for (const endpoint of BUILDINGS_ENDPOINT_CANDIDATES) {
    // const response = await fetch(`${baseUrl}/constructions`, {
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

export async function GET() {
  // return NextResponse.json(mapBuildingsMock);
  try {
    // const constructions = await fetchConstructions();
    const mapBuildings = await fetchMapBuildings();
    const buildings = mapBackendBuildingsToMapBuildings(mapBuildings);

    if (!(await hasValidImage(buildings))) {
      throw new Error("Map buildings payload has no valid image");
    }

    return NextResponse.json(buildings);
  } catch {
    return NextResponse.json(mapBuildingsMock, {
      headers: {
        "x-upaa-fallback": "map-buildings-mock",
      },
    });
  }
}
