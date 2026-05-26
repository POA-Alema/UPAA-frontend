import { NextResponse } from "next/server";
import { getPublicRuntimeConfig } from "@/lib/config";
import { mapBuildingsMock } from "@/features/map/mocks/map-buildings-mock";
import {
  mapBackendBuildingsToMapBuildings,
  type BackendBuilding,
} from "@/features/map/utils/map-buildings";

const API_TIMEOUT_MS = 2_000;
const BUILDINGS_ENDPOINT_CANDIDATES = [
  "/buildings/map?lang=pt",
  "/constructions",
] as const;

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

    return NextResponse.json(buildings);
  } catch {
    return NextResponse.json(mapBuildingsMock, {
      headers: {
        "x-upaa-fallback": "map-buildings-mock",
      },
    });
  }
}
