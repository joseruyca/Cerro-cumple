import { GRID_ROWS, GRID_COLS, posToKey, inBounds, dist, PLAYER_TEMPLATE } from "./battleData";



const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Initialise ──────────────────────────────────────────────
export function initBattle(enemy) {
  return {
    playerHp: PLAYER_TEMPLATE.maxHp,
    playerPos: { ...PLAYER_TEMPLATE.startPos },
    playerMoved: false,
    playerActed: false,
    playerStatuses: [],
    superMeter: 0,
    porroUses: 0,

    enemyHp: enemy.maxHp,
    enemyPos: { ...enemy.startPos },
    enemyStatuses: [],

    turn: "player",
    phase: "move",

    qte: null,
    floats: [],
    lastHitPos: null,
    log: [],
    turn_number: 1,

    // Battle stats
    stats: {
      totalDamageDealt: 0,
      qtesSuccess: 0,
      qtesTotal: 0,
      porrosUsed: 0,
      ultimatesUsed: 0,
      turns: 0,
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────
function addLog(state, msg) {
  return { ...state, log: [...state.log.slice(-30), msg] };
}

function addFloat(state, value, type, pos) {
  const id = Date.now() + Math.random();
  return { ...state, floats: [...state.floats, { id, value, type, pos: { ...pos } }] };
}

export function removeFloat(state, id) {
  return { ...state, floats: state.floats.filter((f) => f.id !== id) };
}

function tickStatuses(statuses) {
  return statuses.map((s) => ({ ...s, turns: s.turns - 1 })).filter((s) => s.turns > 0);
}

function hasStatus(statuses, type) {
  return statuses.some((s) => s.type === type);
}

function applyStatus(statuses, effect) {
  if (!effect) return statuses;
  // Overwrite if same type
  const filtered = statuses.filter((s) => s.type !== effect.type);
  return [...filtered, { type: effect.type, turns: effect.turns }];
}

// ─── Movement ────────────────────────────────────────────────
export function getReachableTiles(pos, range, blockedPositions) {
  const blocked = new Set(blockedPositions.map(posToKey));
  const reachable = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const target = { r, c };
      if (posToKey(target) === posToKey(pos)) continue;
      if (blocked.has(posToKey(target))) continue;
      if (dist(pos, target) <= range) reachable.push(target);
    }
  }
  return reachable;
}

// ─── AOE calculation ─────────────────────────────────────────
export function getAoeTargets(ability, targetPos) {
  if (ability.aoe === "all") return null; // handled specially
  return ability.aoe
    .map(({ dr, dc }) => ({ r: targetPos.r + dr, c: targetPos.c + dc }))
    .filter(inBounds);
}

// ─── Knockback ───────────────────────────────────────────────
// Returns the final position after knockback + any collision damage
function resolveKnockback(entityPos, attackerPos, knockback, otherEntities) {
  if (!knockback) return { finalPos: entityPos, collisionDmg: 0 };

  let dir = { dr: 0, dc: 0 };
  if (knockback.dir === "away") {
    // Push directly away from attacker
    const dr = entityPos.r - attackerPos.r;
    const dc = entityPos.c - attackerPos.c;
    // Normalize to -1/0/1 per axis
    dir = { dr: dr === 0 ? 0 : dr > 0 ? 1 : -1, dc: dc === 0 ? 0 : dc > 0 ? 1 : -1 };
    // If diagonal, prefer column push (horizontal)
    if (dir.dr !== 0 && dir.dc !== 0) dir.dr = 0;
  } else if (knockback.dir === "up") {
    dir = { dr: -1, dc: 0 };
  }

  let pos = { ...entityPos };
  let collisionDmg = 0;
  const occupied = new Set(otherEntities.map(posToKey));

  for (let i = 0; i < knockback.tiles; i++) {
    const next = { r: pos.r + dir.dr, c: pos.c + dir.dc };
    if (!inBounds(next)) {
      collisionDmg += 15; // wall slam
      break;
    }
    if (occupied.has(posToKey(next))) {
      collisionDmg += 10; // collision with entity
      break;
    }
    pos = next;
  }

  return { finalPos: pos, collisionDmg };
}

// ─── Player Move ─────────────────────────────────────────────
export function playerMove(state, targetPos) {
  if (state.playerMoved || state.phase !== "move") return state;
  if (hasStatus(state.playerStatuses, "stun")) return state;

  let next = { ...state, playerPos: targetPos, playerMoved: true };
  next = addLog(next, { type: "info", text: `👟 Cerro se mueve a [${targetPos.r + 1},${targetPos.c + 1}].` });

  // After moving, switch phase to action (can still act)
  next = { ...next, phase: "action" };
  return next;
}

export function skipMove(state) {
  if (state.phase !== "move") return state;
  return { ...state, playerMoved: true, phase: "action" };
}

// ─── Player Attack ────────────────────────────────────────────
export function playerAttack(state, ability, targetPos, enemy) {
  if (state.playerActed || state.phase !== "action") return state;
  if (hasStatus(state.playerStatuses, "stun")) return state;

  let next = { ...state };
  let totalDmg = 0;
  let knockbackResult = { finalPos: state.enemyPos, collisionDmg: 0 };

  // Get all tiles hit
  const hitTiles = ability.aoe === "all"
    ? [state.enemyPos]
    : getAoeTargets(ability, targetPos).filter(
        (t) => posToKey(t) === posToKey(state.enemyPos)
      );

  if (hitTiles.length === 0) {
    next = addLog(next, { type: "info", text: "❌ El ataque no alcanzó al enemigo." });
    return next;
  }

  // Damage
  const dmg = ability.damage;
  totalDmg += dmg;

  // Knockback
  if (ability.knockback) {
    knockbackResult = resolveKnockback(state.enemyPos, state.playerPos, ability.knockback, [state.playerPos]);
    totalDmg += knockbackResult.collisionDmg;
    if (knockbackResult.collisionDmg > 0) {
      next = addLog(next, { type: "player", text: `💥 ¡Colisión! +${knockbackResult.collisionDmg} daño extra.` });
    }
  }

  const newEnemyHp = Math.max(0, state.enemyHp - totalDmg);
  next = { ...next, enemyHp: newEnemyHp, enemyPos: knockbackResult.finalPos, lastHitPos: state.enemyPos };
  next = addFloat(next, totalDmg, "enemy", state.enemyPos);

  // Status on enemy
  if (ability.effect) {
    next = { ...next, enemyStatuses: applyStatus(next.enemyStatuses, ability.effect) };
  }

  next = addLog(next, { type: "player", text: `${ability.icon} Cerro usa ${ability.name}. ${totalDmg} daño.${ability.knockback ? ` Empuje ${ability.knockback.tiles}!` : ""}` });

  // Super meter + stats
  const newSuper = Math.min(100, next.superMeter + 12);
  const newStats = { ...next.stats, totalDamageDealt: next.stats.totalDamageDealt + totalDmg };
  next = { ...next, superMeter: newSuper, playerActed: true, stats: newStats };

  if (newEnemyHp <= 0) {
    return { ...next, phase: "win" };
  }

  return endPlayerTurn(next);
}

// ─── Player Ultimate ──────────────────────────────────────────
export function playerUltimate(state, enemy) {
  if (state.superMeter < 100 || state.playerActed) return state;
  const ult = PLAYER_TEMPLATE.ultimate;
  let next = { ...state };

  const dmg = ult.damage;
  const { finalPos, collisionDmg } = resolveKnockback(state.enemyPos, state.playerPos, ult.knockback, []);
  const total = dmg + collisionDmg;

  const newEnemyHp = Math.max(0, state.enemyHp - total);
  const ultStats = { ...next.stats, totalDamageDealt: next.stats.totalDamageDealt + total, ultimatesUsed: next.stats.ultimatesUsed + 1 };
  next = { ...next, enemyHp: newEnemyHp, enemyPos: finalPos, superMeter: 0, playerActed: true, lastHitPos: state.enemyPos, stats: ultStats };
  next = addFloat(next, total, "ultimate", state.enemyPos);
  next = addLog(next, { type: "ultimate", text: `💥💥 ¡¡DEFINITIVA!! ${ult.name}! ${total} DAÑO MASIVO!` });

  if (newEnemyHp <= 0) return { ...next, phase: "win" };
  
  // Only apply status if enemy survives
  if (ult.effect) {
    next = { ...next, enemyStatuses: applyStatus(next.enemyStatuses, ult.effect) };
  }
  return endPlayerTurn(next);
}

// ─── Player Heal ─────────────────────────────────────────────
export function playerHeal(state) {
  if (state.porroUses >= PLAYER_TEMPLATE.heal.maxUses || state.playerActed) return state;
  const healAmt = PLAYER_TEMPLATE.heal.heal;
  const newHp = Math.min(PLAYER_TEMPLATE.maxHp, state.playerHp + healAmt);
  const healStats = { ...state.stats, porrosUsed: state.stats.porrosUsed + 1 };
  let next = { ...state, playerHp: newHp, porroUses: state.porroUses + 1, playerActed: true, stats: healStats };
  next = addFloat(next, healAmt, "heal", state.playerPos);
  next = addLog(next, { type: "heal", text: `🌿 Cerro se fuma un porro. +${healAmt} HP. El dolor se disuelve como humo.` });
  return endPlayerTurn(next);
}

// ─── End Player Turn ─────────────────────────────────────────
function endPlayerTurn(state) {
  // Poison damage to enemy
  let next = { ...state };
  if (hasStatus(next.enemyStatuses, "poison")) {
    const poisonDmg = 8;
    const newHp = Math.max(0, next.enemyHp - poisonDmg);
    next = { ...next, enemyHp: newHp };
    next = addFloat(next, poisonDmg, "poison", next.enemyPos);
    next = addLog(next, { type: "enemy", text: `☠️ El enemigo sufre ${poisonDmg} daño de veneno.` });
    if (newHp <= 0) return { ...next, phase: "win" };
  }
  next = { ...next, enemyStatuses: tickStatuses(next.enemyStatuses) };
  return { ...next, phase: "enemy" };
}

// ─── Enemy Turn ───────────────────────────────────────────────
export function doEnemyTurn(state, enemy, onEnemyAttack) {
  let next = { ...state };

  // Stun check
  if (hasStatus(next.enemyStatuses, "stun")) {
    next = addLog(next, { type: "system", text: `⭐ ${enemy.name} está aturdido. Pierde el turno.` });
    next = { ...next, enemyStatuses: tickStatuses(next.enemyStatuses) };
    return startPlayerTurn(next);
  }

  // Movement: move toward player
  const moveRange = hasStatus(next.enemyStatuses, "slow") ? 1 : enemy.moveRange;
  const playerKey = posToKey(next.playerPos);
  const blocked = new Set([posToKey(next.playerPos)]);
  let bestPos = next.enemyPos;
  let bestDist = dist(next.enemyPos, next.playerPos);

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const candidate = { r, c };
      const key = posToKey(candidate);
      if (key === posToKey(next.enemyPos)) continue;
      if (blocked.has(key)) continue;
      if (dist(next.enemyPos, candidate) > moveRange) continue;
      const d = dist(candidate, next.playerPos);
      if (d < bestDist) { bestDist = d; bestPos = candidate; }
    }
  }
  if (posToKey(bestPos) !== posToKey(next.enemyPos)) {
    next = { ...next, enemyPos: bestPos };
    next = addLog(next, { type: "enemy", text: `${enemy.icon} ${enemy.name} avanza a [${bestPos.r + 1},${bestPos.c + 1}].` });
  }

  // Pick attack — tactical AI
  const currentDist = dist(next.enemyPos, next.playerPos);
  const available = enemy.attacks.filter((a) => {
    if (a.aoe === "all") return true;
    return a.range >= currentDist;
  });

  if (available.length === 0) {
    next = addLog(next, { type: "system", text: `${enemy.icon} ${enemy.name} no alcanza para atacar.` });
    return startPlayerTurn(next);
  }

  // Tactical: prefer AOE when close, ranged when far, prefer stun on high HP player
  const playerHpPct = next.playerHp / 120;
  let atk;
  const aoeAttacks = available.filter(a => Array.isArray(a.aoe) && a.aoe.length > 1);
  const stunAttacks = available.filter(a => a.effect?.type === "stun");
  const rangedAttacks = available.filter(a => a.range >= 3 && (!Array.isArray(a.aoe) || a.aoe.length === 1));
  const closeAttacks = available.filter(a => a.range <= 1);

  if (currentDist <= 1 && aoeAttacks.length > 0 && rand(0, 1)) {
    atk = aoeAttacks[rand(0, aoeAttacks.length - 1)];
  } else if (playerHpPct > 0.7 && stunAttacks.length > 0 && rand(0, 2) === 0) {
    atk = stunAttacks[rand(0, stunAttacks.length - 1)];
  } else if (currentDist >= 3 && rangedAttacks.length > 0) {
    atk = rangedAttacks[rand(0, rangedAttacks.length - 1)];
  } else if (currentDist <= 1 && closeAttacks.length > 0) {
    atk = closeAttacks[rand(0, closeAttacks.length - 1)];
  } else {
    atk = available[rand(0, available.length - 1)];
  }

  // Knockback on player
  let dmg = atk.damage;
  let knockbackResult = { finalPos: next.playerPos, collisionDmg: 0 };
  if (atk.knockback) {
    knockbackResult = resolveKnockback(next.playerPos, next.enemyPos, atk.knockback, [next.enemyPos]);
    dmg += knockbackResult.collisionDmg;
  }

  // Build QTE — actual damage applied after QTE resolution
  next = addLog(next, { type: "enemy", text: `${atk.icon} ${enemy.name} usa ${atk.name}! ${atk.msg}` });

  if (onEnemyAttack) onEnemyAttack();
  
  return {
    ...next,
    phase: "qte",
    pendingEnemyAttack: {
      atk,
      baseDmg: atk.damage,
      knockbackDmg: knockbackResult.collisionDmg,
      finalPos: knockbackResult.finalPos,
    },
  };
}

// ─── QTE Resolution ──────────────────────────────────────────
export function resolveQte(state, success) {
  if (!state.pendingEnemyAttack) return state;
  const { atk, baseDmg, knockbackDmg, finalPos } = state.pendingEnemyAttack;
  let dmg = baseDmg + knockbackDmg;
  let newPos = finalPos;

  if (success) {
    dmg = Math.floor(dmg * 0.5);
    newPos = state.playerPos;
  }

  const qteStats = {
    ...state.stats,
    qtesTotal: state.stats.qtesTotal + 1,
    qtesSuccess: state.stats.qtesSuccess + (success ? 1 : 0),
  };
  let next = { ...state, pendingEnemyAttack: null, stats: qteStats };

  const newPlayerHp = Math.max(0, next.playerHp - dmg);
  next = { ...next, playerHp: newPlayerHp };

  if (atk.knockback && !success) {
    next = { ...next, playerPos: newPos };
  }

  next = addFloat(next, dmg, success ? "qte_success" : "player", next.playerPos);

  if (success) {
    next = addLog(next, { type: "qte", text: `🛡️ ¡QTE EXITOSO! Daño reducido a ${dmg}. Empuje resistido.` });
  } else {
    next = addLog(next, { type: "enemy", text: `💀 Golpe completo. ${dmg} daño a Cerro.` });
  }

  if (atk.effect) {
    next = { ...next, playerStatuses: applyStatus(next.playerStatuses, atk.effect) };
  }

  // Super from taking damage
  const newSuper = Math.min(100, next.superMeter + 15);
  next = { ...next, superMeter: newSuper };

  if (newPlayerHp <= 0) return { ...next, phase: "lose" };

  // Poison on player
  if (hasStatus(next.playerStatuses, "poison")) {
    const poisonDmg = 6;
    const ph = Math.max(0, next.playerHp - poisonDmg);
    next = { ...next, playerHp: ph };
    next = addFloat(next, poisonDmg, "poison", next.playerPos);
    next = addLog(next, { type: "player", text: `☠️ Cerro sufre ${poisonDmg} de veneno.` });
    if (ph <= 0) return { ...next, phase: "lose" };
  }
  next = { ...next, playerStatuses: tickStatuses(next.playerStatuses) };

  return startPlayerTurn(next);
}

// ─── Start Player Turn ────────────────────────────────────────
function startPlayerTurn(state) {
  return {
    ...state,
    phase: "move",
    playerMoved: false,
    playerActed: false,
    lastHitPos: null,
    turn_number: state.turn_number + 1,
    turn: "player",
    stats: { ...state.stats, turns: state.stats.turns + 1 },
  };
}