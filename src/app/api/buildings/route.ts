import { NextResponse } from "next/server";
import { mapBuildingsMock } from "@/features/map/mocks/map-buildings-mock";

export async function GET() {
  return NextResponse.json(mapBuildingsMock);
}
