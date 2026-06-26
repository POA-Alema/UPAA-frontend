import type { BuildingLanguage } from "../data/buildings";

type BuildingDetailLoadPayload = {
  slug: string;
  language: BuildingLanguage;
  buildingId?: string;
  status?: number;
  reason?: "not_found" | "service_error" | "request_error";
  error?: string;
};

type BuildingDetailAnalyticsEvent = {
  name: "building_detail_load_success" | "building_detail_load_failure";
  payload: BuildingDetailLoadPayload;
};

function trackBuildingDetailEvent(event: BuildingDetailAnalyticsEvent) {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (event.name === "building_detail_load_failure") {
    console.warn("[analytics]", event.name, event.payload);
    return;
  }

  console.info("[analytics]", event.name, event.payload);
}

export function trackBuildingDetailLoadSuccess(
  payload: BuildingDetailLoadPayload,
) {
  trackBuildingDetailEvent({
    name: "building_detail_load_success",
    payload,
  });
}

export function trackBuildingDetailLoadFailure(
  payload: BuildingDetailLoadPayload,
) {
  trackBuildingDetailEvent({
    name: "building_detail_load_failure",
    payload,
  });
}
