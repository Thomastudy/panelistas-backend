import fs from "fs";
import path from "path";

// 3-letras IAU de las 12 constelaciones zodiacales
const ZODIAC = [
  "ari",
  "tau",
  "gem",
  "cnc",
  "leo",
  "vir",
  "lib",
  "sco",
  "sgr",
  "cap",
  "aqr",
  "psc",
  "oph",
  "sun",
];

// Lee el GeoJSON completo
const all = JSON.parse(
  fs.readFileSync(
    path.resolve(
      "node_modules",
      "d3-celestial",
      "data",
      "constellations.bounds.json"
    ),
    "utf8"
  )
);

// Filtra sólo las features zodiacales

const zodiacFeatures = all.features.filter((f) =>
  ZODIAC.includes(f.id.toLowerCase())
);

// Guarda un GeoJSON con sólo las 12 zodiacales
fs.writeFileSync(
  "zodiac-boundaries.json",
  JSON.stringify(
    { type: "FeatureCollection", features: zodiacFeatures },
    null,
    2
  ),
  "utf8"
);

console.log(
  "zodiac-boundaries.json generado con",
  zodiacFeatures.length,
  "constelaciones."
);
