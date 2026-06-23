import { s3ImageUrl } from "@/lib/s3";
import type { Building, BuildingTechnicalSpec, BuildingCharacteristic } from "../types/building";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

type Lang = "pt" | "en" | "de";

// ─── MARGS ───────────────────────────────────────────────────────────────────

const MARGS_SUMMARY: Record<Lang, string> = {
  pt: "Edifício projetado por Theodor Wiederspahn entre 1913 e 1914 para abrigar a antiga Delegacia Fiscal da Fazenda no Rio Grande do Sul, hoje sede do MARGS, na Praça da Alfândega.",
  en: "Building designed by Theodor Wiederspahn between 1913 and 1914 to house the former Tax Office in Rio Grande do Sul, now home to MARGS, on Praça da Alfândega.",
  de: "Gebäude, das zwischen 1913 und 1914 von Theodor Wiederspahn entworfen wurde, um die ehemalige Finanzbehörde in Rio Grande do Sul zu beherbergen, heute Sitz des MARGS am Praça da Alfândega.",
};

const MARGS_HISTORY: Record<Lang, string> = {
  pt: `Localizado na Praça da Alfândega, o Museu de Arte do Rio Grande do Sul, pertencente ao estado, situa-se na área do antigo cais de 1856, aterrada quando da construção do novo porto, de onde se ingressa no centro histórico da cidade pelo Pórtico do Cais Mauá. Projetado e construído de 1913 a 1916, pelo arquiteto Theodor Wiederspahn, com a execução do Engenheiro Rudolph Arhons para abrigar a Delegacia Fiscal.

Seu projeto foi desenvolvido concomitantemente ao dos Correios e Telégrafos. Wiederspahn utilizou o conceito de simetria de forma sutil, na medida em que concebeu dois prédios assimétricos, mas de tal modo que cada qual possuísse uma torre junto à avenida que os separava. Dentro dos pressupostos dos mesmos conceitos do historicismo, o prédio dos Correios e Telégrafos foi revestido de uma linguagem abarrocada e a Delegacia Fiscal de outra, que tendia mais para o classicismo.`,
  en: `Located on Praça da Alfândega, the state-owned Museum of Art of Rio Grande do Sul sits on the grounds of the old 1856 quay, filled in during the construction of the new port, from which one enters the historic center of the city through the Pórtico do Cais Mauá. Designed and built from 1913 to 1916 by architect Theodor Wiederspahn, with construction by Engineer Rudolph Arhons, to house the Fiscal Delegation.

Its design was developed concurrently with that of the Post and Telegraph building. Wiederspahn used the concept of symmetry in a subtle way, conceiving two asymmetric buildings, but each with a tower adjacent to the avenue separating them. Within the same historicist framework, the Post and Telegraph building received a baroque aesthetic while the Fiscal Delegation was given a more classicist language.`,
  de: `Das staatliche Kunstmuseum von Rio Grande do Sul liegt am Praça da Alfândega, auf dem Gelände des alten Kais von 1856, der beim Bau des neuen Hafens aufgefüllt wurde. Entworfen und gebaut von 1913 bis 1916 vom Architekten Theodor Wiederspahn mit der Ausführung durch Ingenieur Rudolph Arhons, um die Finanzbehörde zu beherbergen.

Sein Entwurf wurde gleichzeitig mit dem des Post- und Telegraphengebäudes entwickelt. Wiederspahn setzte das Symmetriekonzept subtil ein: Er konzipierte zwei asymmetrische Gebäude, die jeweils einen Turm an der sie trennenden Allee besitzen. Im selben historistischen Rahmen erhielt das Postgebäude eine barocke Ästhetik, während die ehemalige Finanzbehörde eine klassizistischere Sprache bekam.`,
};

const MARGS_SPECS: Record<Lang, BuildingTechnicalSpec[]> = {
  pt: [
    { label: "Localização", value: "Praça da Alfândega s/n. Centro Histórico de Porto Alegre" },
    { label: "Data", value: "1913 - 1914" },
    { label: "Projeto", value: "Arquiteto Theodor Wiederspahn" },
    { label: "Construção", value: "Engenheiro Rudolph Arhons" },
    { label: "Ornamentos e Esculturas", value: "Oficinas de João Vicente Friederichs, com figuras da fachada de Alfred Adloff" },
    { label: "Área Construída", value: "4.800 m² (aproximadamente)" },
    { label: "Ocupação Atual", value: "Sede do MARGS desde 1978" },
    { label: "Projeto de Restauração", value: "Ediolanda Liedke (1996–1998) e Urbana Logística Ambiental (2015)" },
    { label: "Tombamento", value: "1985 (Governo do Estado do RS) e 2000 (IPHAN)" },
  ],
  en: [
    { label: "Location", value: "Praça da Alfândega, no number. Historic Center of Porto Alegre" },
    { label: "Date", value: "1913 - 1914" },
    { label: "Design", value: "Architect Theodor Wiederspahn" },
    { label: "Construction", value: "Engineer Rudolph Arhons" },
    { label: "Ornamentation", value: "Workshops of João Vicente Friederichs, with facade figures by Alfred Adloff" },
    { label: "Built Area", value: "4,800 m² (approximately)" },
    { label: "Current Use", value: "Home of MARGS since 1978" },
    { label: "Restoration", value: "Ediolanda Liedke (1996–1998) and Urbana Logística Ambiental (2015)" },
    { label: "Heritage Listing", value: "1985 (State Government of RS) and 2000 (IPHAN)" },
  ],
  de: [
    { label: "Standort", value: "Praça da Alfândega, ohne Nummer. Historisches Zentrum von Porto Alegre" },
    { label: "Datum", value: "1913 - 1914" },
    { label: "Entwurf", value: "Architekt Theodor Wiederspahn" },
    { label: "Bau", value: "Ingenieur Rudolph Arhons" },
    { label: "Ornamentik", value: "Werkstätten von João Vicente Friederichs, Fassadenfiguren von Alfred Adloff" },
    { label: "Bebaute Fläche", value: "4.800 m² (ungefähr)" },
    { label: "Aktuelle Nutzung", value: "Sitz des MARGS seit 1978" },
    { label: "Restaurierung", value: "Ediolanda Liedke (1996–1998) und Urbana Logística Ambiental (2015)" },
    { label: "Denkmalschutz", value: "1985 (Landesregierung RS) und 2000 (IPHAN)" },
  ],
};

const MARGS_CHARACTERISTICS: Record<Lang, BuildingCharacteristic[]> = {
  pt: [
    { icon: "balance", title: "Simetria Sutil", description: "Concebido em conjunto com o prédio dos Correios e Telégrafos, forma uma dupla assimétrica unida por torres dispostas junto à avenida que separa as duas edificações." },
    { icon: "account_balance", title: "Linguagem Classicista", description: "Enquanto o prédio dos Correios recebeu uma estética abarrocada, a antiga Delegacia Fiscal foi revestida de uma linguagem voltada ao classicismo, dentro dos preceitos do historicismo da época." },
    { icon: "texture", title: "Esculturas de Fachada", description: "Trabalho ornamental executado pelas oficinas de João Vicente Friederichs, com as figuras da fachada de autoria de Alfred Adloff." },
  ],
  en: [
    { icon: "balance", title: "Subtle Symmetry", description: "Conceived alongside the Post and Telegraph building, it forms an asymmetric pair united by towers placed along the avenue separating the two structures." },
    { icon: "account_balance", title: "Classicist Language", description: "While the Post building received a baroque aesthetic, the former Fiscal Delegation was given a classicist language within the precepts of the historicism of the era." },
    { icon: "texture", title: "Facade Sculptures", description: "Ornamental work executed by João Vicente Friederichs' workshops, with the facade figures by Alfred Adloff." },
  ],
  de: [
    { icon: "balance", title: "Subtile Symmetrie", description: "Zusammen mit dem Post- und Telegraphengebäude konzipiert, bildet es ein asymmetrisches Paar, das durch Türme an der sie trennenden Allee verbunden wird." },
    { icon: "account_balance", title: "Klassizistische Sprache", description: "Während das Postgebäude eine barocke Ästhetik erhielt, wurde die ehemalige Finanzbehörde im Geiste des Historismus mit einer klassizistischen Sprache ausgestattet." },
    { icon: "texture", title: "Fassadenskulpturen", description: "Ornamentales Werk der Werkstätten von João Vicente Friederichs, mit den Fassadenfiguren von Alfred Adloff." },
  ],
};

const MARGS_ARCHITECT_CTA_DESCRIPTION: Record<Lang, string> = {
  pt: "Explore a vida e o legado de Theodor Wiederspahn, o arquiteto que moldou a paisagem urbana de Porto Alegre com suas obras monumentais.",
  en: "Explore the life and legacy of Theodor Wiederspahn, the architect who shaped Porto Alegre's urban landscape with monumental works.",
  de: "Erkunden Sie das Leben und Vermächtnis von Theodor Wiederspahn, dem Architekten, der die Stadtlandschaft von Porto Alegre mit monumentalen Werken prägte.",
};

const ARCHITECT_CTA_LABEL: Record<Lang, string> = {
  pt: "Conheça mais sobre o Arquiteto",
  en: "Learn more about the Architect",
  de: "Mehr über den Architekten erfahren",
};

const BACK_TO_MAP_LABEL: Record<Lang, string> = {
  pt: "Voltar ao Mapa",
  en: "Back to Map",
  de: "Zurück zur Karte",
};

// ─── CCMQ ────────────────────────────────────────────────────────────────────

const CCMQ_SUMMARY: Record<Lang, string> = {
  pt: "Antigo Hotel Majestic, hoje um dos principais polos culturais de Porto Alegre, inaugurado como centro cultural em 1990 após restauração do prédio histórico erguido entre 1916 e 1933.",
  en: "Former Hotel Majestic, now one of Porto Alegre's main cultural hubs, inaugurated as a cultural center in 1990 after the restoration of the historic building erected between 1916 and 1933.",
  de: "Ehemaliges Hotel Majestic, heute eines der wichtigsten Kulturzentren Porto Alegres, 1990 nach der Restaurierung des zwischen 1916 und 1933 errichteten historischen Gebäudes als Kulturzentrum eröffnet.",
};

const CCMQ_HISTORY: Record<Lang, string> = {
  pt: `Erguido entre 1916 e 1933 para abrigar o Hotel Majestic, o edifício foi durante décadas o ponto de encontro da elite intelectual e política de Porto Alegre. Sua imponência classicista e o requinte dos ambientes internos refletiam o prestígio que a cidade conquistava no início do século XX como capital econômica do Rio Grande do Sul.

Após anos de decadência e ameaça de demolição, o prédio foi tombado e restaurado, dando lugar em 1990 à Casa de Cultura Mario Quintana, em homenagem ao poeta gaúcho que ali residiu durante anos. Hoje o espaço reúne teatros, cinemas, bibliotecas, galerias e ateliês, mantendo viva a memória arquitetônica e literária do estado.`,
  en: `Built between 1916 and 1933 to house the Hotel Majestic, the building was for decades the meeting point of Porto Alegre's intellectual and political elite. Its classicist grandeur and the refinement of its interior spaces reflected the prestige the city was gaining in the early 20th century as the economic capital of Rio Grande do Sul.

After years of decline and threats of demolition, the building was listed and restored, giving way in 1990 to the Casa de Cultura Mario Quintana, named after the Gaucho poet who resided there for years. Today the space brings together theaters, cinemas, libraries, galleries and studios, keeping alive the architectural and literary memory of the state.`,
  de: `Das zwischen 1916 und 1933 als Hotel Majestic erbaute Gebäude war jahrzehntelang der Treffpunkt der intellektuellen und politischen Elite Porto Alegres. Seine klassizistische Pracht und die Raffinesse der Innenräume spiegelten das Ansehen wider, das die Stadt zu Beginn des 20. Jahrhunderts als wirtschaftliche Hauptstadt von Rio Grande do Sul erlangte.

Nach Jahren des Verfalls und Abrissdrohungen wurde das Gebäude unter Denkmalschutz gestellt und restauriert, woraus 1990 das Casa de Cultura Mario Quintana entstand, benannt nach dem Gaucho-Dichter, der dort jahrelang lebte. Heute vereint der Raum Theater, Kinos, Bibliotheken, Galerien und Ateliers und bewahrt das architektonische und literarische Gedächtnis des Staates.`,
};

const CCMQ_SPECS: Record<Lang, BuildingTechnicalSpec[]> = {
  pt: [
    { label: "Localização", value: "Rua dos Andradas, 736. Centro Histórico" },
    { label: "Data", value: "1916 - 1933" },
    { label: "Projeto", value: "Arquiteto Theo Wiederspahn" },
    { label: "Função Original", value: "Hotel Majestic" },
    { label: "Reabertura", value: "1990 como Casa de Cultura" },
    { label: "Homenageado", value: "Poeta Mário Quintana" },
    { label: "Tombamento", value: "Patrimônio Histórico Estadual" },
  ],
  en: [
    { label: "Location", value: "Rua dos Andradas, 736. Historic Center" },
    { label: "Date", value: "1916 - 1933" },
    { label: "Design", value: "Architect Theo Wiederspahn" },
    { label: "Original Function", value: "Hotel Majestic" },
    { label: "Reopening", value: "1990 as Cultural Center" },
    { label: "Named After", value: "Poet Mário Quintana" },
    { label: "Heritage Listing", value: "State Historical Heritage" },
  ],
  de: [
    { label: "Standort", value: "Rua dos Andradas, 736. Historisches Zentrum" },
    { label: "Datum", value: "1916 - 1933" },
    { label: "Entwurf", value: "Architekt Theo Wiederspahn" },
    { label: "Ursprüngliche Funktion", value: "Hotel Majestic" },
    { label: "Wiedereröffnung", value: "1990 als Kulturzentrum" },
    { label: "Gewidmet", value: "Dichter Mário Quintana" },
    { label: "Denkmalschutz", value: "Staatliches historisches Erbe" },
  ],
};

const CCMQ_CHARACTERISTICS: Record<Lang, BuildingCharacteristic[]> = {
  pt: [
    { icon: "apartment", title: "Volumetria Eclética", description: "A composição de fachada reúne elementos do classicismo e do art déco, traduzindo a transição estilística vivida pela arquitetura porto-alegrense entre o início e a metade do século XX." },
    { icon: "menu_book", title: "Memória Literária", description: "O quarto 217, ocupado por Mário Quintana, foi preservado e transformado em museu, integrando a arquitetura ao legado literário do poeta gaúcho." },
    { icon: "theaters", title: "Espaços Culturais", description: "A restauração reorganizou os pavimentos para abrigar teatros, salas de cinema, bibliotecas e galerias, criando um circuito cultural verticalizado raro no centro histórico." },
  ],
  en: [
    { icon: "apartment", title: "Eclectic Volume", description: "The facade composition combines elements of classicism and Art Deco, reflecting the stylistic transition in Porto Alegre architecture between the early and mid 20th century." },
    { icon: "menu_book", title: "Literary Memory", description: "Room 217, occupied by Mário Quintana, was preserved and transformed into a museum, integrating architecture with the literary legacy of the Gaucho poet." },
    { icon: "theaters", title: "Cultural Spaces", description: "The restoration reorganized the floors to house theaters, cinema rooms, libraries and galleries, creating a rare vertical cultural circuit in the historic center." },
  ],
  de: [
    { icon: "apartment", title: "Eklektisches Volumen", description: "Die Fassadenkomposition vereint Elemente des Klassizismus und Art Déco und spiegelt den stilistischen Wandel in der Architektur Porto Alegres zwischen dem frühen und mittleren 20. Jahrhundert wider." },
    { icon: "menu_book", title: "Literarisches Gedächtnis", description: "Zimmer 217, das von Mário Quintana bewohnt wurde, wurde erhalten und in ein Museum umgewandelt, das Architektur und literarisches Erbe des Gaucho-Dichters verbindet." },
    { icon: "theaters", title: "Kulturräume", description: "Die Restaurierung reorganisierte die Stockwerke für Theater, Kinos, Bibliotheken und Galerien und schuf einen seltenen vertikalen Kulturkreislauf im historischen Zentrum." },
  ],
};

// ─── Factory ─────────────────────────────────────────────────────────────────

function buildMock(lang: Lang): Building[] {
  return [
    {
      id: "margs",
      slug: "margs",
      eyebrow: "Theodor Wiederspahn, 1913",
      title: "Museu de Arte do Rio Grande do Sul Ado Malagoli",
      subtitle: lang === "en"
        ? "Former Tax Office of the Treasury in the State of Rio Grande do Sul"
        : lang === "de"
          ? "Ehemalige Steuerbehörde des Finanzministeriums im Staat Rio Grande do Sul"
          : "Antiga Delegacia Fiscal da Fazenda no Estado do Rio Grande do Sul",
      summary: MARGS_SUMMARY[lang],
      hero: {
        src: s3ImageUrl("images/margs/Margs.jpg"),
        alt: "Fachada do Museu de Arte do Rio Grande do Sul",
        title: "Fachada principal do MARGS",
        description: LOREM,
      },
      history: MARGS_HISTORY[lang],
      technicalSpecs: MARGS_SPECS[lang],
      characteristics: MARGS_CHARACTERISTICS[lang],
      gallery: [
        { src: s3ImageUrl("images/margs/planta_baixa.jpg"), alt: "Planta baixa do segundo pavimento", caption: "Planta baixa", title: "Planta baixa — 2º pavimento", description: LOREM },
        { src: s3ImageUrl("images/margs/fachadas.jpg"), alt: "Fachada principal da antiga Delegacia Fiscal", caption: "Fachadas", title: "Fachadas", description: LOREM },
        { src: s3ImageUrl("images/margs/fotos_externas.jpg"), alt: "Foto histórica externa do MARGS", caption: "Fotos externas", title: "Fotos externas", description: LOREM },
        { src: s3ImageUrl("images/margs/fotos_internas.jpg"), alt: "Vista interna do hall central do MARGS", caption: "Fotos internas", title: "Hall central", description: LOREM },
        { src: s3ImageUrl("images/margs/escadaria_interna.jpeg"), alt: "Escadaria interna do MARGS", caption: "Escadaria interna", title: "Escadaria interna", description: LOREM },
        { src: s3ImageUrl("images/margs/teto.jpeg"), alt: "Teto do MARGS", caption: "Teto", title: "Teto", description: LOREM },
        { src: s3ImageUrl("images/margs/superior.jpeg"), alt: "Vista da parte superior do MARGS", caption: "Vista da parte superior", title: "Vista da parte superior", description: LOREM },
        { src: s3ImageUrl("images/margs/esculturas.jpeg"), alt: "Esculturas internas do MARGS", caption: "Esculturas internas", title: "Esculturas internas", description: LOREM },
        { src: s3ImageUrl("images/margs/esculturas2.jpeg"), alt: "Esculturas internas do MARGS", caption: "Esculturas internas", title: "Esculturas internas (detalhe)", description: LOREM },
      ],
      architectCta: {
        description: MARGS_ARCHITECT_CTA_DESCRIPTION[lang],
        label: ARCHITECT_CTA_LABEL[lang],
        href: "/architects/theodor-wiederspahn",
      },
      actions: {
        backToMap: { label: BACK_TO_MAP_LABEL[lang], href: "/mapa" },
      },
    },
    {
      id: "casa-de-cultura-mario-quintana",
      slug: "casa-de-cultura-mario-quintana",
      eyebrow: "Theodor Wiederspahn, 1916-1933",
      title: "Casa de Cultura Mario Quintana",
      subtitle: lang === "en" ? "(Former Hotel Majestic)" : lang === "de" ? "(Ehemaliges Hotel Majestic)" : "(Antigo Hotel Majestic)",
      summary: CCMQ_SUMMARY[lang],
      hero: {
        src: s3ImageUrl("images/cdcMarioQuintana.jpg"),
        alt: "Fachada da Casa de Cultura Mario Quintana",
        title: "Fachada da Casa de Cultura Mario Quintana",
        description: LOREM,
      },
      history: CCMQ_HISTORY[lang],
      technicalSpecs: CCMQ_SPECS[lang],
      characteristics: CCMQ_CHARACTERISTICS[lang],
      gallery: [
        { src: s3ImageUrl("images/cdcMarioQuintana.jpg"), alt: "Fachada principal da CCMQ", caption: "Fachada principal", title: "Fachada principal", description: LOREM },
        { src: s3ImageUrl("images/cdcMarioQuintana_2.jpg"), alt: "Detalhe arquitetônico interno da CCMQ", caption: "Detalhe interno", title: "Detalhe interno", description: LOREM },
      ],
      architectCta: {
        description: MARGS_ARCHITECT_CTA_DESCRIPTION[lang],
        label: ARCHITECT_CTA_LABEL[lang],
        href: "/architects/theodor-wiederspahn",
      },
      actions: {
        backToMap: { label: BACK_TO_MAP_LABEL[lang], href: "/mapa" },
      },
    },
  ];
}

export function getBuildingsMock(lang = "pt"): Building[] {
  const safeLang: Lang = lang === "en" || lang === "de" ? lang : "pt";
  return buildMock(safeLang);
}

export const buildingsMock: Building[] = getBuildingsMock("pt");
