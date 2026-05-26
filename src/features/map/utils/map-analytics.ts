type MapLoadAnalyticsPayload = {
  markerCount?: number;
  fallback?: boolean;
  error?: string;
};

type MapLoadAnalyticsEvent = {
  name: "map_buildings_load_success" | "map_buildings_load_failure";
  payload?: MapLoadAnalyticsPayload;
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
