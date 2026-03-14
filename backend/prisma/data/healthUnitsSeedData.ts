type HealthUnitType =
  | "UAI"
  | "UBS"
  | "UBSF"
  | "HOSPITAL"
  | "CAPS"
  | "CER"
  | "COV"
  | "CMAD"
  | "CEREST"
  | "LABORATORY"
  | "OTHER";

type HealthCareLevel =
  | "PRIMARY_CARE"
  | "URGENT_CARE"
  | "SPECIALTY_CARE"
  | "SUPPORT_SERVICE";

type HealthSector = "CENTRAL" | "EAST" | "NORTH" | "SOUTH" | "WEST" | "RURAL";

type HealthUnitSeedItem = {
  name: string;
  unitType: HealthUnitType;
  careLevel: HealthCareLevel;
  sector: HealthSector;
  address: string;
  neighborhood: string | null;
  phone: string | null;
  openingHours: string | null;
  latitude: number | null;
  longitude: number | null;
  officialSourceUrl: string;
  isActive: boolean;
};

export const healthUnitsSeedData: HealthUnitSeedItem[] = [
  {
    name: "UAI Tibery – Anice Dib Jatene",
    unitType: "UAI",
    careLevel: "URGENT_CARE",
    sector: "EAST",
    address: "Avenida Benjamim Magalhães, 1115",
    neighborhood: "Tibery",
    phone: "(34) 3227-8060",
    openingHours: "Pronto Atendimento 24 horas",
    latitude: -18.8895,
    longitude: -48.251,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-leste/",
    isActive: true,
  },
  {
    name: "UBS Tibery – Anice Dib Jatene",
    unitType: "UBS",
    careLevel: "PRIMARY_CARE",
    sector: "EAST",
    address: "Avenida Benjamim Magalhães, 1115",
    neighborhood: "Tibery",
    phone: "(34) 3227-8060",
    openingHours:
      "Funcionamento Ambulatorial e Especialidades: das 7h às 22h de segunda a sexta",
    latitude: -18.8895,
    longitude: -48.251,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-leste/",
    isActive: true,
  },
  {
    name: "UBS Custódio Pereira",
    unitType: "UBS",
    careLevel: "PRIMARY_CARE",
    sector: "EAST",
    address: "Avenida Tito Teixeira, 1236",
    neighborhood: "Custódio Pereira",
    phone: "(34) 3232-4757",
    openingHours: "7h às 19h de segunda a sexta",
    latitude: -18.8835,
    longitude: -48.233,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-leste/",
    isActive: true,
  },
  {
    name: "UAI Morumbi",
    unitType: "UAI",
    careLevel: "URGENT_CARE",
    sector: "EAST",
    address: "Avenida Felipe Calixto Milken, 47",
    neighborhood: "Morumbi",
    phone: "(34) 3226-3325 / 3211-4096 / 3211-6974",
    openingHours: "Pronto Atendimento 24 horas",
    latitude: -18.952,
    longitude: -48.244,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-leste/",
    isActive: true,
  },
  {
    name: "UAI Martins – Dr. João Fernandes de Oliveira",
    unitType: "UAI",
    careLevel: "URGENT_CARE",
    sector: "CENTRAL",
    address: "Avenida Belo Horizonte esquina com Bueno Brandão",
    neighborhood: "Martins",
    phone: "(34) 3215-8331 / 3236-7426",
    openingHours: "Pronto Atendimento 24 horas",
    latitude: -18.9127,
    longitude: -48.2875,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-central/",
    isActive: true,
  },
  {
    name: "UBS Martins – Dr. João Fernandes de Oliveira",
    unitType: "UBS",
    careLevel: "PRIMARY_CARE",
    sector: "CENTRAL",
    address: "Avenida Belo Horizonte esquina com Bueno Brandão",
    neighborhood: "Martins",
    phone: "(34) 3215-8331 / 3236-7426",
    openingHours:
      "Funcionamento Ambulatorial e Especialidades: segunda a sexta-feira, das 7h às 22h",
    latitude: -18.9127,
    longitude: -48.2875,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-central/",
    isActive: true,
  },
  {
    name: "UBS Brasil",
    unitType: "UBS",
    careLevel: "PRIMARY_CARE",
    sector: "CENTRAL",
    address: "Rua Rio Grande do Sul, 931",
    neighborhood: "Brasil",
    phone: "(34) 3232-3722",
    openingHours: "Segunda a sexta-feira, das 7h às 22h",
    latitude: -18.9088,
    longitude: -48.2668,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-central/",
    isActive: true,
  },
  {
    name: "UBSF Bom Jesus",
    unitType: "UBSF",
    careLevel: "PRIMARY_CARE",
    sector: "CENTRAL",
    address: "Rua Niteroi, 225",
    neighborhood: "Bom Jesus",
    phone: "(34) 3236-2408",
    openingHours: "Segunda a sexta-feira, das 7h às 17h",
    latitude: -18.9055,
    longitude: -48.2725,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-central/",
    isActive: true,
  },
  {
    name: "UAI Luizote de Freitas – Dr. Domingos Pimentel de Ulhoa",
    unitType: "UAI",
    careLevel: "URGENT_CARE",
    sector: "WEST",
    address: "Rua Mateus Vaz, 465",
    neighborhood: "Luizote de Freitas",
    phone: "(34) 3223-8005 / 3223-8043",
    openingHours: "Pronto Atendimento 24 horas",
    latitude: -18.9062,
    longitude: -48.3165,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-oeste/",
    isActive: true,
  },
  {
    name: "UBS Luizote de Freitas – Dr. Domingos Pimentel de Ulhoa",
    unitType: "UBS",
    careLevel: "PRIMARY_CARE",
    sector: "WEST",
    address: "Rua Mateus Vaz, 465",
    neighborhood: "Luizote de Freitas",
    phone: "(34) 3223-8005 / 3223-8043",
    openingHours:
      "Funcionamento Ambulatorial e Especialidades: das 7h às 22h de segunda a sexta",
    latitude: -18.9062,
    longitude: -48.3165,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-oeste/",
    isActive: true,
  },
  {
    name: "UAI Planalto – Tubal Vilela da Silva",
    unitType: "UAI",
    careLevel: "URGENT_CARE",
    sector: "WEST",
    address: "Rua do Engenheiro, 246",
    neighborhood: "Planalto",
    phone: "(34) 3227-8010 / 3232-5575",
    openingHours: "Pronto Atendimento 24 horas",
    latitude: -18.9035,
    longitude: -48.3325,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-oeste/",
    isActive: true,
  },
  {
    name: "UBS Dona Zulmira",
    unitType: "UBS",
    careLevel: "PRIMARY_CARE",
    sector: "WEST",
    address: "Rua da Mica, 223",
    neighborhood: "Dona Zulmira",
    phone: "(34) 3238-1455",
    openingHours: "7h às 19h de segunda a sexta",
    latitude: -18.9055,
    longitude: -48.3045,
    officialSourceUrl:
      "https://www.uberlandia.mg.gov.br/prefeitura/secretarias/saude/unidades-de-atendimento-em-saude/setor-oeste/",
    isActive: true,
  },
];
