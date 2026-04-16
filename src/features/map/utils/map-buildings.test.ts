import { describe, it, expect } from "vitest";
import { mapBuildingsToMarkers } from "./map-buildings";

describe("mapBuildingsToMarkers", () => {
  it("deve retornar apenas edificações com coordenadas válidas", () => {
    const mock = [
      { id: 1, name: "A", latitude: -30, longitude: -51 },
      { id: 2, name: "B" },
      { id: 3, name: "C", latitude: -30.1, longitude: -51.2 },
    ];

    const result = mapBuildingsToMarkers(mock);

    expect(result).toHaveLength(2);
  });

  it("deve retornar lista vazia se nenhuma tiver coordenadas", () => {
    const mock = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ];

    const result = mapBuildingsToMarkers(mock);

    expect(result).toHaveLength(0);
  });

  it("deve mapear corretamente latitude e longitude para position", () => {
    const mock = [
      { id: 1, name: "A", latitude: -30, longitude: -51 },
    ];

    const result = mapBuildingsToMarkers(mock);

    expect(result[0].position).toEqual([-30, -51]);
  });

  it("deve aceitar coordenadas zero como valores validos", () => {
    const mock = [
      { id: 1, name: "A", latitude: 0, longitude: 0 },
    ];

    const result = mapBuildingsToMarkers(mock);

    expect(result).toHaveLength(1);
    expect(result[0].position).toEqual([0, 0]);
  });
});
