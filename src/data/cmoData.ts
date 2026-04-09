export interface CmoEntry {
  id: string;
  name: string;
  homeTerritory: string;
  type: "Rights Holder" | "Performer" | "Rights Holder & Performer";
}

export const cmos: CmoEntry[] = [
  { id: "1",  name: "ACTRA RACS",    homeTerritory: "Canada",          type: "Rights Holder & Performer" },
  { id: "2",  name: "AGEDI",         homeTerritory: "Spain",           type: "Rights Holder" },
  { id: "3",  name: "AIE",           homeTerritory: "Spain",           type: "Performer" },
  { id: "4",  name: "AURA",          homeTerritory: "Finland",         type: "Rights Holder & Performer" },
  { id: "5",  name: "BUMA STEMRA",   homeTerritory: "Netherlands",     type: "Rights Holder" },
  { id: "6",  name: "GVL",           homeTerritory: "Germany",         type: "Performer" },
  { id: "7",  name: "Gramex",        homeTerritory: "Denmark",         type: "Performer" },
  { id: "8",  name: "IFPI Danmark",  homeTerritory: "Denmark",         type: "Rights Holder" },
  { id: "9",  name: "IFPI Sverige",  homeTerritory: "Sweden",          type: "Rights Holder" },
  { id: "10", name: "IPRS",          homeTerritory: "India",           type: "Rights Holder & Performer" },
  { id: "11", name: "ITSRIGHT",      homeTerritory: "South Korea",     type: "Rights Holder & Performer" },
  { id: "12", name: "MRCSN",         homeTerritory: "Serbia",          type: "Rights Holder & Performer" },
  { id: "13", name: "PlayRight",     homeTerritory: "Belgium",         type: "Performer" },
  { id: "14", name: "PPL",           homeTerritory: "United Kingdom",  type: "Rights Holder & Performer" },
  { id: "15", name: "RAAP",          homeTerritory: "Ireland",         type: "Rights Holder & Performer" },
  { id: "16", name: "RMNC",          homeTerritory: "Norway",          type: "Rights Holder" },
  { id: "17", name: "SAMI",          homeTerritory: "Sweden",          type: "Performer" },
  { id: "18", name: "SCPP",          homeTerritory: "France",          type: "Rights Holder" },
  { id: "19", name: "SCF",           homeTerritory: "Italy",           type: "Rights Holder" },
  { id: "20", name: "SENA",          homeTerritory: "Netherlands",     type: "Rights Holder & Performer" },
  { id: "21", name: "SIMIM",         homeTerritory: "Belgium",         type: "Rights Holder" },
  { id: "22", name: "SoundExchange", homeTerritory: "United States",   type: "Rights Holder" },
  { id: "23", name: "Teosto",        homeTerritory: "Finland",         type: "Rights Holder" },
  { id: "24", name: "TONO",          homeTerritory: "Norway",          type: "Performer" },
  { id: "25", name: "VDFS",          homeTerritory: "Austria",         type: "Rights Holder & Performer" },
];
