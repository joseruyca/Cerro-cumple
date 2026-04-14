// ─────────────────────────────────────────────────────────────
// GRID: 3 filas × 6 columnas  (row 0-2, col 0-5)
// Jugador empieza lado izquierdo, enemigos lado derecho
// ─────────────────────────────────────────────────────────────
export const GRID_ROWS = 3;
export const GRID_COLS = 6;

export const posToKey = ({ r, c }) => `${r},${c}`;
export const keyToPos = (k) => { const [r, c] = k.split(",").map(Number); return { r, c }; };
export const inBounds = ({ r, c }) => r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS;

// Manhattan distance
export const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);

// ─────────────────────────────────────────────────────────────
// PLAYER
// ─────────────────────────────────────────────────────────────
export const PLAYER_TEMPLATE = {
  id: "cerro",
  name: "Cerro",
  icon: "🎂",
  maxHp: 120,
  moveRange: 2,
  startPos: { r: 1, c: 1 },
  abilities: [
    {
      id: "guantazo",
      name: "Guantazo por Apuesta",
      icon: "🥊",
      damage: 22,
      range: 1,
      aoe: [{ dr: 0, dc: 0 }],
      knockback: { dir: "away", tiles: 2 },
      effect: null,
      description: "Un guantazo apostado. Empuja 2 casillas.",
      color: "from-yellow-600 to-yellow-500",
    },
    {
      id: "video",
      name: "Video Traumático",
      icon: "📱",
      damage: 18,
      range: 3,
      aoe: [{ dr: 0, dc: 0 }],
      knockback: null,
      effect: { type: "stun", turns: 1 },
      description: "Envía un video traumático a distancia. Aturde 1 turno.",
      color: "from-blue-700 to-blue-500",
    },
    {
      id: "pogo",
      name: "Empujón de Pogo",
      icon: "🎸",
      damage: 18,
      range: 1,
      aoe: [{ dr: -1, dc: 0 }, { dr: 0, dc: 0 }, { dr: 1, dc: 0 }],
      knockback: { dir: "away", tiles: 3 },
      effect: null,
      description: "Empujón del mosh pit. Área en columna. Empuja 3.",
      color: "from-purple-700 to-purple-500",
    },
  ],
  ultimate: {
    id: "furia_popper",
    name: "¡FURIA DE POPPER!",
    icon: "🌿",
    damage: 65,
    range: 99,
    aoe: "all",
    knockback: { dir: "away", tiles: 3 },
    effect: { type: "stun", turns: 2 },
    description: "La furia del popper desatada. Golpea a TODOS. Empuja 3. Aturde 2 turnos.",
    color: "from-green-700 to-red-700",
  },
  heal: {
    id: "porro",
    name: "Porro Medicinal",
    icon: "💨",
    heal: 35,
    maxUses: 3,
    description: "Curación +35 HP. 3 usos totales.",
    color: "from-green-700 to-emerald-600",
  },
};

// ─────────────────────────────────────────────────────────────
// ENEMIES
// ─────────────────────────────────────────────────────────────
export const ENEMIES = [
  // ── FASE 1 ──────────────────────────────────────────────────
  {
    id: "cartman",
    name: "Eric Cartman",
    title: "Fase 1 · El Gordo Manipulador",
    icon: "😈",
    maxHp: 85,
    moveRange: 1,
    startPos: { r: 1, c: 4 },
    color: "text-red-400",
    bgColor: "from-red-950 via-red-900 to-orange-950",
    deathQuote: "'Esto no es canon. Voy a llorarle a mi mamá.'",
    attacks: [
      {
        id: "insulto", name: "Insulto Existencial", icon: "🗣️",
        damage: 14, range: 3,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: null, effect: null,
        msg: "Cartman grita '¡Sos la decepción de tu familia!' Duele más de lo esperado.",
      },
      {
        id: "salami", name: "Salami Volador", icon: "🥩",
        damage: 18, range: 1,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: { dir: "away", tiles: 2 },
        effect: null,
        msg: "Cartman te tira un salami. El impacto + el olor es devastador.",
      },
      {
        id: "pastel", name: "Trampa de Pastel", icon: "🎂",
        damage: 20, range: 2,
        aoe: [{ dr: -1, dc: 0 }, { dr: 0, dc: 0 }, { dr: 1, dc: 0 }],
        knockback: { dir: "away", tiles: 1 },
        effect: { type: "poison", turns: 2 },
        msg: "Ingredientes secretos. Tu estómago se declara república independiente.",
      },
    ],
  },

  // ── FASE 2 · enemigo A ───────────────────────────────────────
  {
    id: "kenny",
    name: "Kenny McCormick",
    title: "Fase 2A · El Inmortal",
    icon: "🧣",
    maxHp: 70,
    moveRange: 3,
    startPos: { r: 1, c: 4 },
    color: "text-orange-400",
    bgColor: "from-orange-950 via-orange-900 to-amber-950",
    deathQuote: "'¡Oh dios mío, mataron a Kenny! Otra vez. Ya van 5 hoy.'",
    attacks: [
      {
        id: "mfph", name: "¡MMFPH!!", icon: "🧣",
        damage: 16, range: 1,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: { dir: "away", tiles: 2 },
        effect: null,
        msg: "Kenny grita algo incomprensible y te manda volando.",
      },
      {
        id: "resurreccion", name: "Resurrección Violenta", icon: "👻",
        damage: 12, range: 2,
        aoe: [{ dr: -1, dc: 0 }, { dr: 0, dc: 0 }, { dr: 1, dc: 0 }],
        knockback: { dir: "up", tiles: 1 },
        effect: null,
        msg: "Kenny muere y resurge encima tuyo. La física deja de aplicar.",
      },
      {
        id: "miseria", name: "Miseria Contagiosa", icon: "💸",
        damage: 10, range: 3,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: null,
        effect: { type: "slow", turns: 2 },
        msg: "La pobreza de Kenny te deprime. Movimiento reducido 2 turnos.",
      },
    ],
  },

  // ── FASE 2 · enemigo B ───────────────────────────────────────
  {
    id: "stan",
    name: "Stan Marsh",
    title: "Fase 2B · El Cringe Total",
    icon: "🎿",
    maxHp: 75,
    moveRange: 2,
    startPos: { r: 1, c: 4 },
    color: "text-blue-400",
    bgColor: "from-blue-950 via-blue-900 to-slate-950",
    deathQuote: "'Dios, esto es la cosa más asquerosa que vi en mi vida. Y viví en South Park.'",
    attacks: [
      {
        id: "discurso", name: "Discurso Moral", icon: "📣",
        damage: 15, range: 3,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: null,
        effect: { type: "stun", turns: 1 },
        msg: "Stan da un sermón sobre el sentido de la vida. Te quedás paralizado de cringe.",
      },
      {
        id: "tackle", name: "Tackle de Rugby", icon: "🏈",
        damage: 20, range: 1,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: { dir: "away", tiles: 3 },
        effect: null,
        msg: "Stan te embiste como si estuviera jugando la final del estado.",
      },
      {
        id: "vomito", name: "Vómito Nervioso", icon: "🤢",
        damage: 12, range: 1,
        aoe: [{ dr: -1, dc: 0 }, { dr: 0, dc: 0 }, { dr: 1, dc: 0 }],
        knockback: null,
        effect: { type: "poison", turns: 2 },
        msg: "Stan vomita sobre todos. Envenenado 2 turnos. Clásico Stan.",
      },
    ],
  },

  // ── FASE 3 · JEFE FINAL ──────────────────────────────────────
  {
    id: "maestro_doblaje",
    name: "El Maestro del Doblaje",
    title: "Fase 3 · JEFE FINAL · La Voz Definitiva",
    icon: "🎙️",
    maxHp: 160,
    moveRange: 2,
    startPos: { r: 1, c: 4 },
    color: "text-yellow-300",
    bgColor: "from-zinc-950 via-purple-950 to-black",
    deathQuote: "'¡Nooooo! Mi carrera en doblaje... destruida. Esto es más forzado que mis doblajes. NOOO--'",
    attacks: [
      {
        id: "voz_omega", name: "PRONUNCIACIÓN FORZADA", icon: "📻",
        damage: 28, range: 99,
        aoe: "all",
        knockback: { dir: "away", tiles: 2 },
        effect: { type: "stun", turns: 1 },
        msg: "El Maestro grita con un acento tan forzado que tus tímpanos se rebelan. '¡PIEROOOOOO!'",
      },
      {
        id: "doblaje_traumatico", name: "EMOCIONES FALSAS", icon: "🎭",
        damage: 24, range: 3,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: null,
        effect: { type: "poison", turns: 3 },
        msg: "Te somete a ver un personaje pasando de estar tranquilo a gritar '¡¿QUÉ?!' en 0.5 segundos. Trauma puro.",
      },
      {
        id: "eco_infernal", name: "RESPIRACIÓN INNECESARIA", icon: "🔊",
        damage: 22, range: 2,
        aoe: [{ dr: -1, dc: 0 }, { dr: 0, dc: 0 }, { dr: 1, dc: 0 }],
        knockback: { dir: "away", tiles: 2 },
        effect: null,
        msg: "El Maestro respira sonoramente entre cada palabra como si estuviera jadeante. Tan. Forzado. 'Haaaa... buenas... haaaa... tardes...'",
      },
      {
        id: "contrato_maldito", name: "TONO GENÉRICO ESPAÑOL", icon: "📜",
        damage: 32, range: 1,
        aoe: [{ dr: 0, dc: 0 }],
        knockback: { dir: "away", tiles: 3 },
        effect: { type: "slow", turns: 2 },
        msg: "Todos los personajes de anime hablan como don Antonio de la provincia de Ávila. El daño es existencial.",
      },
    ],
  },
];

// BATTLE_SEQUENCE: 3 pantallas. Pantalla 2 tiene 2 sub-enemigos (kenny -> stan)
export const BATTLE_SEQUENCE = [
  { id: "phase1", enemies: ["cartman"], label: "Fase 1/3" },
  { id: "phase2", enemies: ["kenny", "stan"], label: "Fase 2/3" },
  { id: "phase3", enemies: ["maestro_doblaje"], label: "⚠️ JEFE FINAL" },
];

// STATUS EFFECTS
export const STATUS_LABELS = {
  stun: { icon: "⭐", label: "Aturdido", color: "text-yellow-300" },
  poison: { icon: "☠️", label: "Envenenado", color: "text-green-400" },
  slow: { icon: "🐌", label: "Lento", color: "text-blue-300" },
};

// QTE config
export const QTE_WINDOW_MS = 1200;
export const QTE_REDUCTION = 0.5; // 50% daño reducido si tiene éxito