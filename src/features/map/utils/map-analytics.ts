type MapLoadAnalyticsPayload = {
  markerCount?: number;
  fallback?: boolean;
  error?: string;
};

type MapRecentralizationAnalyticsPayload = {
  reason: "outside_limit" | "permission_denied" | "unavailable";
};

type MapLoadAnalyticsEvent = {
  name: "map_buildings_load_success" | "map_buildings_load_failure";
  payload?: MapLoadAnalyticsPayload;
} | {
  name: "map_recentralization";
  payload: MapRecentralizationAnalyticsPayload;
};

function trackMapEvent(event: MapLoadAnalyticsEvent) {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (event.name === "map_buildings_load_failure") {
    console.warn("[analytics]", event.name, event.payload);
    return;
  }

  console.info("[analytics]", event.name, event.payload);
}

export function trackMapBuildingsLoadSuccess(payload: MapLoadAnalyticsPayload) {
  trackMapEvent({
    name: "map_buildings_load_success",
    payload,
  });
}

export function trackMapBuildingsLoadFailure(payload: MapLoadAnalyticsPayload) {
  trackMapEvent({
    name: "map_buildings_load_failure",
    payload,
  });
}

export function trackMapRecentralization(
  payload: MapRecentralizationAnalyticsPayload,
) {
  trackMapEvent({
    name: "map_recentralization",
    payload,
  });
}
