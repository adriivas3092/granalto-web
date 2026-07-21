import type { Environment, Surface } from "./types";

/**
 * Ambientes de demostración como escenas vectoriales (2D por capas).
 * Cada superficie editable define su geometría (`path`), que equivale a la
 * "máscara". Para reemplazar por fotografías reales: sustituya `decor`/`overlay`
 * por <image href="/ruta.webp"/> y ajuste los `path` a las zonas de la foto.
 *
 * viewBox de trabajo: 1200 x 800.
 */

const VB = "0 0 1200 800";
const r = (x: number, y: number, w: number, h: number) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`;

/* ------------------------------------------------------------------ COCINA */

function kitchenSurfaces(def: {
  counter: string; cabinets: string; backsplash: string; floor: string; faucet: string; sink: string;
}): Surface[] {
  return [
    { id: "floor", name: "Piso", kind: "floor", path: r(0, 640, 1200, 160), z: 1, shade: 0.06, textureScale: 1.7, defaultMaterialId: def.floor },
    { id: "backsplash", name: "Salpicadero", kind: "backsplash", path: r(60, 300, 1080, 145), z: 2, shade: 0.03, textureScale: 0.7, defaultMaterialId: def.backsplash },
    { id: "cabinets", name: "Gabinetes", kind: "cabinets", path: `${r(60, 478, 1080, 162)} ${r(80, 120, 440, 180)} ${r(680, 120, 440, 180)}`, z: 3, shade: 0.12, textureScale: 1, defaultMaterialId: def.cabinets },
    { id: "countertop", name: "Sobre de cocina", kind: "countertop", path: r(48, 445, 1104, 34), z: 4, shade: 0, textureScale: 1, defaultMaterialId: def.counter },
    { id: "sink", name: "Fregadero", kind: "sink", path: "M545 451 h110 a12 12 0 0 1 12 12 v3 a14 14 0 0 1 -14 14 h-118 a14 14 0 0 1 -14 -14 v-3 a12 12 0 0 1 12 -12 z", z: 5, shade: 0.05, defaultMaterialId: def.sink },
    { id: "faucet", name: "Grifería", kind: "faucet", path: "M596 402 q0 -22 18 -22 q16 0 16 16 v10 h-10 v-8 q0 -8 -6 -8 q-8 0 -8 12 v34 h-10 z", z: 6, shade: 0, defaultMaterialId: def.faucet },
  ];
}

const kitchenDecor = (wall: string, sky: string) => `
  <rect x="0" y="0" width="1200" height="640" fill="${wall}"/>
  <rect x="556" y="150" width="88" height="150" rx="4" fill="${sky}"/>
  <line x1="600" y1="150" x2="600" y2="300" stroke="#ffffff" stroke-opacity="0.5" stroke-width="3"/>
  <line x1="556" y1="225" x2="644" y2="225" stroke="#ffffff" stroke-opacity="0.5" stroke-width="3"/>`;

const kitchenOverlay = `
  <g stroke="#000" stroke-opacity="0.18" stroke-width="3">
    <line x1="300" y1="150" x2="300" y2="290"/><line x1="900" y1="150" x2="900" y2="290"/>
    <line x1="300" y1="500" x2="300" y2="620"/><line x1="600" y1="500" x2="600" y2="620"/><line x1="900" y1="500" x2="900" y2="620"/>
  </g>
  <rect x="48" y="472" width="1104" height="7" fill="#000" opacity="0.14"/>
  <rect x="60" y="632" width="1080" height="10" fill="#000" opacity="0.12"/>`;

/* ------------------------------------------------------------------- BAÑO */

function bathSurfaces(def: Record<string, string>): Surface[] {
  return [
    { id: "floor", name: "Piso", kind: "floor", path: r(0, 660, 1200, 140), z: 1, shade: 0.07, textureScale: 1.6, defaultMaterialId: def.floor },
    { id: "wall", name: "Enchape de pared", kind: "wall", path: r(0, 0, 760, 660), z: 2, shade: 0.02, textureScale: 0.9, defaultMaterialId: def.wall },
    { id: "shower-wall", name: "Pared de ducha", kind: "shower-wall", path: r(760, 0, 440, 660), z: 2, shade: 0.05, textureScale: 0.9, defaultMaterialId: def.showerWall },
    { id: "niche", name: "Nicho", kind: "niche", path: r(980, 200, 140, 130), z: 3, shade: 0.14, textureScale: 0.5, defaultMaterialId: def.niche },
    { id: "vanity", name: "Mueble de baño", kind: "vanity", path: r(80, 430, 440, 210), z: 3, shade: 0.12, textureScale: 1, defaultMaterialId: def.vanity },
    { id: "vanity-top", name: "Sobre", kind: "vanity-top", path: r(60, 402, 480, 32), z: 4, shade: 0, textureScale: 1, defaultMaterialId: def.vanityTop },
    { id: "washbasin", name: "Lavamanos", kind: "washbasin", path: "M250 384 h140 a16 16 0 0 1 16 16 v2 a22 22 0 0 1 -22 22 h-128 a22 22 0 0 1 -22 -22 v-2 a16 16 0 0 1 16 -16 z", z: 5, shade: 0.05, defaultMaterialId: def.washbasin },
    { id: "faucet", name: "Grifería", kind: "faucet", path: "M312 360 q0 -20 16 -20 q14 0 14 14 v8 h-9 v-6 q0 -7 -5 -7 q-7 0 -7 11 v28 h-9 z", z: 6, shade: 0, defaultMaterialId: def.faucet },
    { id: "shower", name: "Ducha", kind: "shower", path: "M1060 120 h80 v10 h-34 v150 h-10 v-150 h-36 z", z: 6, shade: 0, defaultMaterialId: def.shower },
  ];
}

const bathDecor = (accent: string) => `
  <rect x="0" y="0" width="1200" height="660" fill="${accent}"/>`;

const bathOverlay = `
  <rect x="140" y="150" width="360" height="220" rx="6" fill="none" stroke="#000" stroke-opacity="0.18" stroke-width="4"/>
  <rect x="760" y="0" width="6" height="660" fill="#000" opacity="0.12"/>
  <rect x="760" y="0" width="440" height="660" fill="#bcd3e6" opacity="0.08"/>
  <rect x="60" y="428" width="480" height="7" fill="#000" opacity="0.14"/>
  <g stroke="#000" stroke-opacity="0.16" stroke-width="3"><line x1="300" y1="470" x2="300" y2="620"/></g>`;

/* -------------------------------------------------------------------- BBQ */

function bbqSurfaces(def: Record<string, string>): Surface[] {
  return [
    { id: "floor", name: "Piso", kind: "floor", path: r(0, 620, 1200, 180), z: 1, shade: 0.08, textureScale: 1.8, defaultMaterialId: def.floor },
    { id: "backsplash", name: "Pared / Backsplash", kind: "backsplash", path: r(120, 250, 960, 180), z: 2, shade: 0.03, textureScale: 0.8, defaultMaterialId: def.backsplash },
    { id: "facade", name: "Fachada de barra", kind: "facade", path: r(180, 470, 840, 170), z: 3, shade: 0.14, textureScale: 1.1, defaultMaterialId: def.facade },
    { id: "cabinets", name: "Gabinetes", kind: "cabinets", path: `${r(210, 495, 270, 125)} ${r(720, 495, 270, 125)}`, z: 4, shade: 0.18, textureScale: 1, defaultMaterialId: def.cabinets },
    { id: "countertop", name: "Sobre", kind: "countertop", path: r(150, 435, 900, 40), z: 5, shade: 0, textureScale: 1, defaultMaterialId: def.counter },
    { id: "grill", name: "Parrilla", kind: "grill", path: r(520, 402, 180, 40), z: 6, shade: 0.1, defaultMaterialId: def.grill },
    { id: "sink", name: "Fregadero", kind: "sink", path: "M812 442 h96 a12 12 0 0 1 12 12 v2 a14 14 0 0 1 -14 14 h-104 a14 14 0 0 1 -14 -14 v-2 a12 12 0 0 1 12 -12 z", z: 6, shade: 0.05, defaultMaterialId: def.sink },
  ];
}

const bbqDecor = `
  <rect x="0" y="0" width="1200" height="430" fill="#a9c7d9"/>
  <rect x="0" y="360" width="1200" height="90" fill="#8fae78"/>
  <circle cx="1040" cy="130" r="52" fill="#f4e6bf" opacity="0.7"/>`;

const bbqOverlay = `
  <g stroke="#000" stroke-opacity="0.35" stroke-width="4">
    <line x1="530" y1="412" x2="690" y2="412"/><line x1="530" y1="424" x2="690" y2="424"/><line x1="530" y1="436" x2="690" y2="436"/>
  </g>
  <rect x="150" y="470" width="900" height="8" fill="#000" opacity="0.15"/>
  <g stroke="#000" stroke-opacity="0.2" stroke-width="3"><line x1="600" y1="495" x2="600" y2="620"/></g>
  <ellipse cx="600" cy="700" rx="470" ry="26" fill="#000" opacity="0.10"/>`;

/* ---------------------------------------------------------- ENCHAPE PARED */

function wallSurfaces(defMaterial: string): Surface[] {
  return [
    { id: "floor", name: "Piso", kind: "floor", path: r(0, 660, 1200, 140), z: 1, shade: 0.06, textureScale: 1.7 },
    { id: "feature-wall", name: "Pared destacada", kind: "feature-wall", path: r(120, 40, 960, 620), z: 2, shade: 0.03, textureScale: 0.9, defaultMaterialId: defMaterial },
  ];
}

const wallDecors: Record<string, { decor: string; overlay: string; base: string }> = {
  sala: {
    base: "#e7e2d8",
    decor: `<rect x="0" y="0" width="1200" height="660" fill="#e7e2d8"/><rect x="0" y="40" width="120" height="620" fill="#dcd6c9"/><rect x="1080" y="40" width="120" height="620" fill="#dcd6c9"/>`,
    overlay: `<g fill="#9a8f7d" opacity="0.9"><rect x="300" y="520" width="600" height="120" rx="20"/><rect x="300" y="470" width="600" height="80" rx="18"/><rect x="300" y="470" width="70" height="170" rx="16"/><rect x="830" y="470" width="70" height="170" rx="16"/></g><ellipse cx="600" cy="700" rx="420" ry="24" fill="#000" opacity="0.08"/>`,
  },
  comedor: {
    base: "#e5e5df",
    decor: `<rect x="0" y="0" width="1200" height="660" fill="#e5e5df"/>`,
    overlay: `<g fill="#8a7a5e" opacity="0.9"><rect x="380" y="500" width="440" height="20" rx="6"/><rect x="400" y="520" width="14" height="120"/><rect x="786" y="520" width="14" height="120"/></g><g fill="#6f6152"><rect x="430" y="430" width="40" height="90" rx="10"/><rect x="580" y="430" width="40" height="90" rx="10"/><rect x="730" y="430" width="40" height="90" rx="10"/></g><ellipse cx="600" cy="700" rx="360" ry="22" fill="#000" opacity="0.08"/>`,
  },
  habitacion: {
    base: "#e9e3da",
    decor: `<rect x="0" y="0" width="1200" height="660" fill="#e9e3da"/>`,
    overlay: `<g fill="#b9ab93" opacity="0.95"><rect x="300" y="520" width="600" height="120" rx="14"/><rect x="300" y="470" width="600" height="60" rx="12"/></g><g fill="#efeae1"><rect x="330" y="500" width="120" height="60" rx="10"/><rect x="750" y="500" width="120" height="60" rx="10"/></g><ellipse cx="600" cy="700" rx="410" ry="24" fill="#000" opacity="0.08"/>`,
  },
  oficina: {
    base: "#e4e6e4",
    decor: `<rect x="0" y="0" width="1200" height="660" fill="#e4e6e4"/>`,
    overlay: `<g fill="#5c5c5c" opacity="0.9"><rect x="360" y="520" width="480" height="18" rx="4"/><rect x="380" y="538" width="12" height="102"/><rect x="808" y="538" width="12" height="102"/></g><rect x="520" y="430" width="160" height="96" rx="8" fill="#3a3f45"/><ellipse cx="600" cy="700" rx="340" ry="20" fill="#000" opacity="0.08"/>`,
  },
  lobby: {
    base: "#e8e4dc",
    decor: `<rect x="0" y="0" width="1200" height="660" fill="#e8e4dc"/>`,
    overlay: `<g fill="#7d7361" opacity="0.9"><rect x="340" y="470" width="520" height="170" rx="10"/><rect x="340" y="470" width="520" height="40" rx="10"/></g><g fill="#9fb58e"><rect x="150" y="430" width="60" height="210" rx="8"/><rect x="990" y="430" width="60" height="210" rx="8"/></g><ellipse cx="600" cy="700" rx="430" ry="24" fill="#000" opacity="0.08"/>`,
  },
};

function wallEnvironment(subtype: string, name: string, defMaterial: string): Environment {
  const d = wallDecors[subtype];
  return {
    id: `wall-${subtype}`,
    type: "wall",
    name,
    subtype,
    description: `Pared destacada para ${name.toLowerCase()}.`,
    viewBox: VB,
    baseFill: d.base,
    decor: d.decor,
    overlay: d.overlay,
    surfaces: wallSurfaces(defMaterial),
  };
}

/* ------------------------------------------------------------ AMBIENTES */

export const ENVIRONMENTS: Environment[] = [
  {
    id: "kitchen-moderna",
    type: "kitchen",
    name: "Cocina moderna",
    description: "Cocina en L con isla y muebles altos.",
    viewBox: VB,
    baseFill: "#e8e4dc",
    decor: kitchenDecor("#e8e4dc", "#bcd3e6"),
    overlay: kitchenOverlay,
    surfaces: kitchenSurfaces({
      counter: "cuarzo-calacatta", cabinets: "lacado-grafito", backsplash: "ceramica-metro",
      floor: "porcelanico-gris", faucet: "metal-negro", sink: "sanitario-negro",
    }),
  },
  {
    id: "kitchen-calida",
    type: "kitchen",
    name: "Cocina cálida",
    description: "Cocina con madera natural y tonos suaves.",
    viewBox: VB,
    baseFill: "#efe7d9",
    decor: kitchenDecor("#efe7d9", "#cfe0ec"),
    overlay: kitchenOverlay,
    surfaces: kitchenSurfaces({
      counter: "cuarzo-blanco", cabinets: "madera-roble", backsplash: "porcelanico-marmol",
      floor: "porcelanato-arena", faucet: "metal-oro", sink: "sanitario-blanco",
    }),
  },
  {
    id: "bath-moderno",
    type: "bathroom",
    name: "Baño moderno",
    description: "Baño con ducha de vidrio y mueble suspendido.",
    viewBox: VB,
    baseFill: "#e6e6e3",
    decor: bathDecor("#e6e6e3"),
    overlay: bathOverlay,
    surfaces: bathSurfaces({
      floor: "porcelanico-gris", wall: "porcelanico-marmol", showerWall: "ceramica-metro",
      niche: "marmol-carrara", vanity: "lacado-grafito", vanityTop: "cuarzo-blanco",
      washbasin: "sanitario-blanco", faucet: "metal-negro", shower: "metal-negro",
    }),
  },
  {
    id: "bath-spa",
    type: "bathroom",
    name: "Baño spa",
    description: "Baño estilo spa con piedra y maderas.",
    viewBox: VB,
    baseFill: "#e9e3d8",
    decor: bathDecor("#e9e3d8"),
    overlay: bathOverlay,
    surfaces: bathSurfaces({
      floor: "travertino", wall: "microcemento-gris", showerWall: "travertino",
      niche: "marmol-emperador", vanity: "madera-nogal", vanityTop: "marmol-carrara",
      washbasin: "sanitario-arena", faucet: "metal-oro", shower: "metal-oro",
    }),
  },
  {
    id: "bbq-moderna",
    type: "bbq",
    name: "BBQ moderna",
    description: "Isla exterior con parrilla y fregadero.",
    viewBox: VB,
    baseFill: "#cdd6cf",
    decor: bbqDecor,
    overlay: bbqOverlay,
    surfaces: bbqSurfaces({
      counter: "granito-negro", facade: "microcemento-gris", floor: "porcelanato-arena",
      backsplash: "pizarra-antracita", cabinets: "lacado-grafito", grill: "metal-acero", sink: "metal-acero",
    }),
  },
  {
    id: "bbq-piedra",
    type: "bbq",
    name: "BBQ de piedra",
    description: "Barra exterior revestida en piedra natural.",
    viewBox: VB,
    baseFill: "#d2d2c6",
    decor: bbqDecor,
    overlay: bbqOverlay,
    surfaces: bbqSurfaces({
      counter: "cuarzo-calacatta", facade: "travertino", floor: "porcelanico-gris",
      backsplash: "travertino", cabinets: "madera-nogal", grill: "metal-acero", sink: "metal-acero",
    }),
  },
  wallEnvironment("sala", "Sala", "travertino"),
  wallEnvironment("comedor", "Comedor", "porcelanico-marmol"),
  wallEnvironment("habitacion", "Habitación", "microcemento-gris"),
  wallEnvironment("oficina", "Oficina", "pizarra-antracita"),
  wallEnvironment("lobby", "Lobby", "marmol-carrara"),
];

const ENV_BY_ID = new Map(ENVIRONMENTS.map((e) => [e.id, e]));

export function getEnvironment(id: string): Environment | undefined {
  return ENV_BY_ID.get(id);
}

export function environmentsByType(type: string): Environment[] {
  return ENVIRONMENTS.filter((e) => e.type === type);
}

export const ENVIRONMENT_TYPES: { type: Environment["type"]; label: string }[] = [
  { type: "kitchen", label: "Cocina" },
  { type: "bathroom", label: "Baño" },
  { type: "wall", label: "Enchape de pared" },
  { type: "bbq", label: "BBQ" },
];
