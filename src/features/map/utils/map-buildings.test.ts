import { describe, expect, it } from "vitest";
import {
  buildBuildingDetailPath,
  mapBackendBuildingsToMapBuildings,
  mapBuildingsToMarkers,
} from "./map-buildings";

describe("buildBuildingDetailPath", () => {
  it("deve montar a rota de detalhe da edificacao a partir do slug", () => {
    expect(buildBuildingDetailPath("margs")).toBe("/buildings/margs");
  });
});

describe("mapBuildingsToMarkers", () => {
  it("deve retornar apenas edificacoes com coordenadas validas", () => {
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
    const mock = [{ id: 1, name: "A", latitude: -30, longitude: -51 }];

    const result = mapBuildingsToMarkers(mock);

    expect(result[0].position).toEqual([-30, -51]);
  });

  it("deve aceitar coordenadas zero como valores validos", () => {
    const mock = [{ id: 1, name: "A", latitude: 0, longitude: 0 }];

    const result = mapBuildingsToMarkers(mock);

    expect(result).toHaveLength(1);
    expect(result[0].position).toEqual([0, 0]);
  });

  it("deve preservar metadados e montar a rota da obra a partir do slug", () => {
    const attachments = [
      { src: "/images/a.jpg", alt: "Imagem A", caption: "Vista frontal" },
    ];
    const mock = [
      {
        id: 7,
        name: "Museu X",
        slug: "museu-x",
        district: "Centro Historico",
        summary: "Descricao curta da obra",
        yearLabel: "1912",
        architectName: "Theodor Wiederspahn",
        architectPath: "/architects/theodor-wiederspahn",
        attachments,
        latitude: -30.01,
        longitude: -51.22,
      },
    ];

    const [result] = mapBuildingsToMarkers(mock);

    expect(result).toMatchObject({
      id: 7,
      name: "Museu X",
      slug: "museu-x",
      district: "Centro Historico",
      summary: "Descricao curta da obra",
      yearLabel: "1912",
      architectName: "Theodor Wiederspahn",
      routePath: "/buildings/museu-x?returnTo=%2Fmapa",
      architectPath: "/architects/theodor-wiederspahn",
      position: [-30.01, -51.22],
    });
    expect(result.attachments).toEqual(attachments);
  });

  it("deve deixar routePath indefinido quando a edificacao nao tiver slug", () => {
    const mock = [
      { id: 1, name: "Sem slug", latitude: -30, longitude: -51, attachments: [] },
    ];

    const [result] = mapBuildingsToMarkers(mock);

    expect(result.routePath).toBeUndefined();
  });
});

describe("mapBackendBuildingsToMapBuildings", () => {
  it("deve adaptar o payload de buildings/map para o formato do mapa", () => {
    const [result] = mapBackendBuildingsToMapBuildings([
      {
        id: "backend-map-id",
        slug: "margs",
        name: "MARGS",
        location: "Centro Historico",
        coordinates: { lat: -30.01, lng: -51.22 },
        current_occupation: "Museu de arte",
        media_gallery: [
          {
            url: "/images/Margs.jpg",
            caption: "Fachada principal",
          },
        ],
      },
    ]);

    expect(result).toMatchObject({
      id: "backend-map-id",
      name: "MARGS",
      slug: "margs",
      district: "Centro Historico",
      summary: "Museu de arte",
      latitude: -30.01,
      longitude: -51.22,
    });
    expect(result.attachments).toEqual([
      expect.objectContaining({
        src: "/images/Margs.jpg",
        alt: "Fachada principal",
        caption: "Fachada principal",
      }),
    ]);
  });

  it("deve adaptar o payload atual de buildings/map do backend", () => {
    const [result] = mapBackendBuildingsToMapBuildings([
      {
        id: "backend-map-id",
        slug: "margs",
        name: "MARGS",
        architect: {
          slug: "joao-da-silva",
          name: "Joao da Silva",
        },
        summary: "Resumo da edificacao",
        coordinates: { latitude: -30.01, longitude: -51.22 },
        coverImage: {
          url: "/images/Margs.jpg",
          alt: "Fachada do MARGS",
          caption: "Fachada principal",
        },
      },
    ]);

    expect(result).toMatchObject({
      id: "backend-map-id",
      name: "MARGS",
      slug: "margs",
      architectName: "Joao da Silva",
      architectPath: "/architects/joao-da-silva",
      summary: "Resumo da edificacao",
      latitude: -30.01,
      longitude: -51.22,
    });
    expect(result.attachments).toEqual([
      expect.objectContaining({
        src: "/images/Margs.jpg",
        alt: "Fachada do MARGS",
        caption: "Fachada principal",
      }),
    ]);
  });

  it("deve adaptar o payload real de constructions para o formato do mapa", () => {
    const [result] = mapBackendBuildingsToMapBuildings([
      {
        id: "backend-id",
        slug: "margs",
        name: { pt: "MARGS", en: "Rio Grande do Sul Art Museum" },
        location: { pt: "Centro Historico" },
        coordinates: { lat: -30.01, lng: -51.22 },
        constructionPeriod: "1913",
        description: { pt: "Descricao da edificacao" },
        architect: { slug: "theo-wiederspahn", name: { full: "Theo Wiederspahn" } },
        mediaGallery: [
          {
            url: "/images/Margs.jpg",
            caption: { pt: "Fachada principal" },
          },
        ],
      },
    ]);

    expect(result).toMatchObject({
      id: "backend-id",
      name: "MARGS",
      slug: "margs",
      district: "Centro Historico",
      summary: "Descricao da edificacao",
      yearLabel: "1913",
      architectName: "Theo Wiederspahn",
      architectPath: "/architects/theo-wiederspahn",
      latitude: -30.01,
      longitude: -51.22,
    });
    expect(result.attachments).toEqual([
      expect.objectContaining({
        src: "/images/Margs.jpg",
        alt: "Fachada principal",
        caption: "Fachada principal",
      }),
    ]);
  });

  it("deve aceitar o formato simples de constructions como compatibilidade", () => {
    const [result] = mapBackendBuildingsToMapBuildings([
      {
        id: "simple-id",
        slug: "obra-simples",
        title: "Obra simples",
        latitude: -30,
        longitude: -51,
        buildYear: 1980,
        images: ["/images/obra.jpg"],
      },
    ]);

    expect(result).toMatchObject({
      id: "simple-id",
      name: "Obra simples",
      slug: "obra-simples",
      yearLabel: "1980",
      latitude: -30,
      longitude: -51,
    });
    expect(result.attachments).toEqual([
      expect.objectContaining({
        src: "/images/obra.jpg",
        alt: "Obra simples",
      }),
    ]);
  });
});
