import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  pt: {
    common: {
      nav: {
        section_intro: "Introdução",
        section_immigration: "Imigração",
        section_map: "Mapa",
        section_architects: "Arquitetos",
      },

      header: {
        action_map: "Mapa",
        action_home: "Home",
        lang_pt: "Português",
        lang_de: "Deutsch",
        lang_en: "English",
        language_source_persisted: "Idioma definido pelo usuário",
        language_source_browser: "Idioma detectado pelo navegador",
        language_source_default: "Idioma padrão aplicado",
      },

      footer: {
        title: "Uma Porto Alegre Alemã",
        subtitle:
          "Explorando a herança arquitetônica alemã no centro histórico de Porto Alegre.",
        project_line: "Projeto Acadêmico desenvolvido na PUCRS",
      },

      home: {
        intro_description:
          "Explore no mapa as obras que transformaram Porto Alegre e descubra como esse legado ainda marca a paisagem da cidade.",
        intro_cta: "Explorar Mapa",
        map_preview_alt:
          "Mapa de Porto Alegre com destaque para alguns edifícios de estilo germânico.",
        no_content: "Nenhum conteúdo disponível no momento",
      },

      landing: {
        title: "O Legado da Arquitetura Alemã",
        description:
          "Explorando edifícios, memórias e instituições que marcaram o Centro Histórico de Porto Alegre.",
      },

      immigration: {
        eyebrow: "Herança cultural, memória e formação do estado",
        title: "A Imigração Alemã no Rio Grande do Sul",
        content:
          "A imigração alemã no Rio Grande do Sul teve início em 1824, com a chegada de famílias vindas principalmente da Alemanha em busca de melhores condições de vida. Esses imigrantes foram instalados em colônias agrícolas e contribuíram muito para o desenvolvimento econômico e cultural do estado. Além da agricultura, trouxeram costumes, tradições, festas, arquitetura e a língua alemã, que influenciaram várias regiões gaúchas. Cidades como São Leopoldo, Novo Hamburgo e Gramado guardam até hoje marcas dessa herança. A imigração alemã foi muito importante para a formação da identidade cultural do Rio Grande do Sul.",
        image_alt:
          "Fachada do Museu de Arte do Rio Grande do Sul, edificação histórica no centro de Porto Alegre",
      },

      architect: {
        eyebrow: "O Arquiteto da Elegância",
        bio_summary:
          "Arquiteto germano-brasileiro (1878-1952) que se destacou em Porto Alegre, deixando um legado marcante na arquitetura eclética do início do século XX.",
        image_caption:
          "Theodor Wiederspahn, um dos maiores nomes da arquitetura gaúcha.",
        detail_origin_label: "Origem",
        detail_origin_value: "Wiesbaden, Alemanha",
        detail_origin_sub: "Nascimento: 1878",
        detail_death_label: "Morte",
        detail_death_value: "Porto Alegre, Brasil",
        detail_death_sub: "Falecimento: 1952",
        action_biography: "Ver Biografia",
        action_explore_works: "Explorar Obras",
        cta_description:
          "A herança de Wiederspahn está espalhada pelo centro de Porto Alegre, esperando para ser descoberta em cada detalhe de suas fachadas.",
        char_eclectic_title: "Ecletismo Monumental",
        char_eclectic_desc:
          "Sua obra é caracterizada pela fusão harmônica entre o neoclássico e o barroco, definindo o horizonte da capital gaúcha através de proporções imponentes e riqueza ornamental.",
        char_detail_title: "Riqueza de Detalhes",
        char_detail_desc:
          "Colaboração constante com artistas e escultores como Alfred Adloff, resultando em fachadas com figuras alegóricas e elementos decorativos de alta qualidade técnica.",
        char_innovation_title: "Inovação Estrutural",
        char_innovation_desc:
          "Pioneiro no uso de novas tecnologias construtivas para a época, como grandes vãos, claraboias zenitais e estruturas que permitiam ambientes amplos e iluminados.",
        page_legacy_prefix: "O Legado de",
        page_bio_heading: "História",
        page_characteristics_heading: "Características Arquitetônicas",
        page_works_heading: "Obras Marcantes",
        page_back_to_map: "Voltar ao Mapa",
      },

      map: {
        close_details: "Fechar detalhes da edificação",
        image_unavailable: "Imagem indisponível",
        mapped_building: "Edificação mapeada",
        page_unavailable: "Página da edificação ainda não disponível",
        see_more: "Ver mais",
        year: "Ano",
        author: "Autoria",
        know_work: "Conhecer a obra",
        know_author: "Conhecer o autor",
        open_route: "Abrir rota",
        open_route_aria: "Abrir rota em aplicativo de navegação",
        image_label: "Imagem",
        loading: "Carregando dados do mapa.",
        empty: "Nenhum ponto disponivel para exibir.",
        load_error: "Nao foi possivel carregar os dados do mapa.",
        you_are_here: "Voce esta aqui",
        alert_recentered_outside_limit:
          "Você está fora da área útil do mapa. Recentralizando no Centro Histórico.",
        alert_recentered_permission_denied:
          "Permissão de geolocalização negada. Exibindo o mapa centralizado no Centro Histórico.",
        alert_geolocation_unavailable:
          "Geolocalização não disponível. Exibindo o mapa centralizado no Centro Histórico.",
      },

      building: {
        section_title: "Edificação",
        map_title: "Mapa",
        map_placeholder:
          "Integração com o mapa será conectada assim que a feature correspondente estiver disponível.",
        history_heading: "Histórico",
        characteristics_heading: "Características Arquitetônicas",
        gallery_heading: "Galeria de Fotos",
        architect_cta_title: "O Arquiteto",
        back_to_map: "Voltar ao Mapa",
        architect_cta_label: "Conheça mais sobre o Arquiteto",
      },
      image: {
        expand: "Ampliar imagem",
        close: "Fechar imagem ampliada",
      },
      building_materials: {
        title: "Galeria de materiais",
        slide_hint: "Deslize",
        list_label: "Materiais adicionais da edificação",
        open_label: "Abrir {{type}}: {{title}}",
        empty: "Nenhum material adicional cadastrado.",
        unnamed: "Material",
        types: {
          plant: "Planta",
          document: "Documento",
          analysis: "Análise",
        },
      },
    },
  },

  en: {
    common: {
      nav: {
        section_intro: "Intro",
        section_immigration: "Immigration",
        section_map: "Map",
        section_architects: "Architects",
      },

      header: {
        action_map: "Map",
        action_home: "Home",
        lang_pt: "Português",
        lang_de: "Deutsch",
        lang_en: "English",
        language_source_persisted: "Language set by user",
        language_source_browser: "Language detected from browser",
        language_source_default: "Default language applied",
      },

      footer: {
        title: "A Germanic Porto Alegre",
        subtitle:
          "Exploring Germanic architectural heritage in Porto Alegre historic center.",
        project_line: "Academic project developed at PUCRS",
      },

      home: {
        intro_description:
          "Explore on the map the works that transformed Porto Alegre and discover how this legacy still shapes the city's landscape.",
        intro_cta: "Explore Map",
        map_preview_alt:
          "Preview map of Porto Alegre with a focus on some germanic buildings",
        no_content: "No content available at the moment",
      },

      landing: {
        title: "The Legacy of German Architecture",
        description:
          "Exploring buildings, memories and institutions that shaped Porto Alegre's Historic Center.",
      },

      immigration: {
        eyebrow: "Cultural heritage, memory and state formation",
        title: "German Immigration in Rio Grande do Sul",
        content:
          "German immigration in Rio Grande do Sul began in 1824, with the arrival of families mainly from Germany seeking better living conditions. These immigrants were settled in agricultural colonies and contributed greatly to the economic and cultural development of the state. Besides agriculture, they brought customs, traditions, festivals, architecture and the German language, which influenced several regions of Rio Grande do Sul. Cities like São Leopoldo, Novo Hamburgo and Gramado still bear the marks of this heritage. German immigration was very important for shaping the cultural identity of Rio Grande do Sul.",
        image_alt:
          "Facade of the Museum of Art of Rio Grande do Sul, a historic building in Porto Alegre's city center",
      },

      architect: {
        eyebrow: "The Architect of Elegance",
        bio_summary:
          "German-Brazilian architect (1878-1952) who stood out in Porto Alegre, leaving a remarkable legacy in the eclectic architecture of the early 20th century.",
        image_caption:
          "Theodor Wiederspahn, one of the greatest names in Rio Grande do Sul architecture.",
        detail_origin_label: "Origin",
        detail_origin_value: "Wiesbaden, Germany",
        detail_origin_sub: "Born: 1878",
        detail_death_label: "Death",
        detail_death_value: "Porto Alegre, Brazil",
        detail_death_sub: "Died: 1952",
        action_biography: "View Biography",
        action_explore_works: "Explore Works",
        cta_description:
          "Wiederspahn's heritage is spread throughout Porto Alegre's city center, waiting to be discovered in every detail of its facades.",
        char_eclectic_title: "Monumental Eclecticism",
        char_eclectic_desc:
          "His work is characterized by the harmonious fusion of neoclassical and baroque, defining the skyline of the state capital through imposing proportions and ornamental richness.",
        char_detail_title: "Richness of Detail",
        char_detail_desc:
          "Constant collaboration with artists and sculptors such as Alfred Adloff, resulting in facades with allegorical figures and high-quality decorative elements.",
        char_innovation_title: "Structural Innovation",
        char_innovation_desc:
          "Pioneer in the use of new construction technologies for the time, such as large spans, zenith skylights and structures that allowed spacious and well-lit environments.",
        page_legacy_prefix: "The Legacy of",
        page_bio_heading: "History",
        page_characteristics_heading: "Architectural Characteristics",
        page_works_heading: "Notable Works",
        page_back_to_map: "Back to Map",
      },

      map: {
        close_details: "Close building details",
        image_unavailable: "Image unavailable",
        mapped_building: "Mapped building",
        page_unavailable: "Building page not yet available",
        see_more: "See more",
        year: "Year",
        author: "Author",
        know_work: "Discover the work",
        know_author: "Discover the author",
        open_route: "Open route",
        open_route_aria: "Open route in navigation app",
        image_label: "Image",
        loading: "Loading map data.",
        empty: "No points available to display.",
        load_error: "Unable to load map data.",
        you_are_here: "You are here",
        alert_recentered_outside_limit:
          "You are outside the useful map area. Recentering to the Historic Center.",
        alert_recentered_permission_denied:
          "Location permission denied. Showing the map centered on the Historic Center.",
        alert_geolocation_unavailable:
          "Geolocation unavailable. Showing the map centered on the Historic Center.",
      },

      building: {
        section_title: "Building",
        map_title: "Map",
        map_placeholder:
          "Map integration will be connected as soon as the corresponding feature is available.",
        history_heading: "History",
        characteristics_heading: "Architectural Characteristics",
        gallery_heading: "Photo Gallery",
        architect_cta_title: "The Architect",
        back_to_map: "Back to Map",
        architect_cta_label: "Learn more about the Architect",
      },
      image: {
        expand: "Expand image",
        close: "Close expanded image",
      },
      building_materials: {
        title: "Materials gallery",
        slide_hint: "Slide",
        list_label: "Additional building materials",
        open_label: "Open {{type}}: {{title}}",
        empty: "No additional materials registered.",
        unnamed: "Material",
        types: {
          plant: "Floor plan",
          document: "Document",
          analysis: "Analysis",
        },
      },
    },
  },

  de: {
    common: {
      nav: {
        section_intro: "Einführung",
        section_immigration: "Immigration",
        section_map: "Karte",
        section_architects: "Architekten",
      },

      header: {
        action_map: "Karte",
        action_home: "Start",
        lang_pt: "Português",
        lang_de: "Deutsch",
        lang_en: "English",
        language_source_persisted: "Sprache vom Benutzer festgelegt",
        language_source_browser: "Sprache vom Browser erkannt",
        language_source_default: "Standardsprache angewendet",
      },

      footer: {
        title: "Ein deutsches Porto Alegre",
        subtitle:
          "Erkunden des deutsch beeinflussten architektonischen Erbes im historischen Zentrum von Porto Alegre.",
        project_line: "Akademisches Projekt an der PUCRS",
      },

      home: {
        intro_description:
          "Erkunden Sie auf der Karte die Werke, die Porto Alegre verwandelt haben, und entdecken Sie, wie dieses Erbe die Stadtlandschaft noch heute prägt.",
        intro_cta: "Karte Erkunden",
        map_preview_alt:
          "Vorschaukarte von Porto Alegre mit Schwerpunkt auf einigen germanischen Gebäuden",
        no_content: "Derzeit keine Inhalte verfügbar",
      },

      landing: {
        title: "Das Erbe der deutschen Architektur",
        description:
          "Erkundung von Gebäuden, Erinnerungen und Institutionen, die das historische Zentrum von Porto Alegre geprägt haben.",
      },

      immigration: {
        eyebrow: "Kulturelles Erbe, Erinnerung und Staatsbildung",
        title: "Deutsche Einwanderung in Rio Grande do Sul",
        content:
          "Die deutsche Einwanderung in Rio Grande do Sul begann 1824 mit der Ankunft von Familien hauptsächlich aus Deutschland, die bessere Lebensbedingungen suchten. Diese Einwanderer wurden in landwirtschaftlichen Kolonien angesiedelt und trugen maßgeblich zur wirtschaftlichen und kulturellen Entwicklung des Bundesstaates bei. Neben der Landwirtschaft brachten sie Bräuche, Traditionen, Feste, Architektur und die deutsche Sprache mit, die mehrere Regionen von Rio Grande do Sul beeinflussten. Städte wie São Leopoldo, Novo Hamburgo und Gramado tragen bis heute die Spuren dieses Erbes. Die deutsche Einwanderung war sehr wichtig für die Bildung der kulturellen Identität von Rio Grande do Sul.",
        image_alt:
          "Fassade des Kunstmuseums von Rio Grande do Sul, ein historisches Gebäude im Zentrum von Porto Alegre",
      },

      architect: {
        eyebrow: "Der Architekt der Eleganz",
        bio_summary:
          "Deutsch-brasilianischer Architekt (1878-1952), der sich in Porto Alegre hervortat und ein bemerkenswertes Erbe in der eklektischen Architektur des frühen 20. Jahrhunderts hinterließ.",
        image_caption:
          "Theodor Wiederspahn, einer der größten Namen der Architektur von Rio Grande do Sul.",
        detail_origin_label: "Herkunft",
        detail_origin_value: "Wiesbaden, Deutschland",
        detail_origin_sub: "Geburt: 1878",
        detail_death_label: "Tod",
        detail_death_value: "Porto Alegre, Brasilien",
        detail_death_sub: "Gestorben: 1952",
        action_biography: "Biografie ansehen",
        action_explore_works: "Werke erkunden",
        cta_description:
          "Wiederspahns Erbe ist über das Zentrum von Porto Alegre verteilt und wartet darauf, in jedem Detail seiner Fassaden entdeckt zu werden.",
        char_eclectic_title: "Monumentaler Eklektizismus",
        char_eclectic_desc:
          "Sein Werk zeichnet sich durch die harmonische Verschmelzung von Neoklassik und Barock aus und definiert die Skyline der Landeshauptstadt durch imposante Proportionen und ornamentalen Reichtum.",
        char_detail_title: "Detailreichtum",
        char_detail_desc:
          "Ständige Zusammenarbeit mit Künstlern und Bildhauern wie Alfred Adloff, die zu Fassaden mit allegorischen Figuren und hochwertigen dekorativen Elementen führte.",
        char_innovation_title: "Strukturelle Innovation",
        char_innovation_desc:
          "Pionier im Einsatz neuer Bautechnologien für die damalige Zeit, wie große Spannweiten, Oberlichtfenster und Strukturen, die geräumige und gut beleuchtete Umgebungen ermöglichten.",
        page_legacy_prefix: "Das Erbe von",
        page_bio_heading: "Geschichte",
        page_characteristics_heading: "Architektonische Merkmale",
        page_works_heading: "Bedeutende Werke",
        page_back_to_map: "Zurück zur Karte",
      },

      map: {
        close_details: "Gebäudedetails schließen",
        image_unavailable: "Bild nicht verfuegbar",
        mapped_building: "Kartiertes Gebäude",
        page_unavailable: "Gebäudeseite noch nicht verfügbar",
        see_more: "Mehr sehen",
        year: "Jahr",
        author: "Autor",
        know_work: "Das Werk entdecken",
        know_author: "Den Autor kennenlernen",
        open_route: "Route öffnen",
        open_route_aria: "Route in Navigations-App öffnen",
        image_label: "Bild",
        loading: "Kartendaten werden geladen.",
        empty: "Keine Punkte zum Anzeigen verfuegbar.",
        load_error: "Kartendaten konnten nicht geladen werden.",
        you_are_here: "Du bist hier",
        alert_recentered_outside_limit:
          "Sie befinden sich ausserhalb des nutzbaren Kartenbereichs. Karte wird auf das historische Zentrum zentriert.",
        alert_recentered_permission_denied:
          "Standortberechtigung verweigert. Karte wird auf das historische Zentrum zentriert.",
        alert_geolocation_unavailable:
          "Geolokalisierung nicht verfuegbar. Karte wird auf das historische Zentrum zentriert.",
      },

      building: {
        section_title: "Gebäude",
        map_title: "Karte",
        map_placeholder:
          "Die Kartenintegration wird verfügbar sein, sobald die entsprechende Funktion bereitsteht.",
        history_heading: "Geschichte",
        characteristics_heading: "Architektonische Merkmale",
        gallery_heading: "Fotogalerie",
        architect_cta_title: "Der Architekt",
        back_to_map: "Zurück zur Karte",
        architect_cta_label: "Mehr über den Architekten erfahren",
      },
      image: {
        expand: "Bild vergrößern",
        close: "Vergrößertes Bild schließen",
      },
      building_materials: {
        title: "Materialgalerie",
        slide_hint: "Wischen",
        list_label: "Zusätzliche Gebäudematerialien",
        open_label: "{{type}} öffnen: {{title}}",
        empty: "Keine zusätzlichen Materialien registriert.",
        unnamed: "Material",
        types: {
          plant: "Plan",
          document: "Dokument",
          analysis: "Analyse",
        },
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
