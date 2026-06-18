// Headless smoke test: loads the game script with DOM stubs and
// exercises the unlock + cost mechanics.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

// --- DOM / browser stubs ---
const elements = {};
function el(id) {
  if (!elements[id]) elements[id] = { innerHTML: '', textContent: '', className: '', classList: { add(){}, remove(){} }, hidden: true, setAttribute() {} };
  return elements[id];
}
global.document = {
  getElementById: el,
  querySelector: () => null,
  body: { dataset: {}, classList: { toggle() {} } },
  addEventListener() {},
};
global.window = {
  innerWidth: 1280,
  innerHeight: 800,
  addEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {} }),
};
global.requestAnimationFrame = () => {};
global.performance = { now: () => 0 };
global.localStorage = { _s: {}, getItem(k){ return this._s[k] ?? null; }, setItem(k,v){ this._s[k]=v; }, removeItem(k){ delete this._s[k]; } };
global.setInterval = () => {};
global.prompt = () => null;
global.alert = () => {};
global.confirm = () => false;

eval(script + '\n;globalThis.S = S; globalThis.Device = Device;');

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  ok: ' + name); }
  else      { fail++; console.log('FAIL: ' + name); }
}

// Fight/Barter start locked and hidden
check('fight locked initially', !isSkillUnlocked('fight'));
check('barter locked initially', !isSkillUnlocked('barter'));
check('sidebar hides fight', !el('skill-sidebar').innerHTML.includes('Fight'));
check('sidebar shows Unlocks tab', el('skill-sidebar').innerHTML.includes('Unlocks'));

// Unlocks panel shows progress
selectTab('unlocks');
check('unlocks panel shows fight progress', el('activity-panel').innerHTML.includes('power acquired'));

// Acquiring 10 power unlocks Fight (and spending does not re-lock)
gainRes('power', 10);
check('fight unlocks at 10 power acquired', isSkillUnlocked('fight'));
check('barter still locked', !isSkillUnlocked('barter'));
S.res.power = 0; // spend it all
checkUnlocks();
check('fight stays unlocked after spending', isSkillUnlocked('fight'));
check('sidebar now shows Fight', el('skill-sidebar').innerHTML.includes('Fight'));

// Starting Fight without power fails and shows a halt message
startActivity('fight', 0);
check('cannot start fight without power', S.running === null);
check('halt message set', el('bottom-bar').innerHTML.includes('Not enough power'));

// With power, starting Fight deducts the cost upfront
gainRes('power', 5);
startActivity('fight', 0);
check('fight starts with power', S.running && S.running.skillId === 'fight');
check('cost deducted upfront (5-1=4)', Math.abs(S.res.power - 4) < 1e-9);

// Barter unlocks via money and pays out quintessence
gainRes('money', 10);
check('barter unlocks at 10 money acquired', isSkillUnlocked('barter'));

// Save and reload round-trips the new state
saveGame();
S.unlocked.fight = false; S.total.power = 0; S.res.power = 0;
loadGame();
check('save restores unlocked.fight', S.unlocked.fight === true);
check('save restores total.power', S.total.power === 15);
check('save restores running fight activity', S.running && S.running.skillId === 'fight');

// Old save without totals seeds them from current resources
applySave({ res: { power: 12 } });
check('legacy save seeds total from res', S.total.power === 12);
check('legacy save still unlocks fight via seeded total', (checkUnlocks(), isSkillUnlocked('fight')));

// --- Upgrades ---
check('payoff multiplier starts at 1', payoffMult('study') === 1);

// Can't buy below required level or without resources
buyUpgrade('study-0');
check('cannot buy below level 5', !S.upgrades['study-0']);
S.skills.study.lv = 5;
S.res.knowledge = 10;
buyUpgrade('study-0');
check('cannot buy without resources', !S.upgrades['study-0']);

// Valid purchase deducts cost and doubles payoff
S.res.knowledge = 60;
buyUpgrade('study-0');
check('upgrade purchased', S.upgrades['study-0'] === true);
check('cost deducted (60-50=10)', Math.abs(S.res.knowledge - 10) < 1e-9);
check('payoff doubled', payoffMult('study') === 2);
buyUpgrade('study-0');
check('cannot buy twice', Math.abs(S.res.knowledge - 10) < 1e-9);

// Two upgrades stack to x4
S.skills.study.lv = 10;
S.res.knowledge = 300;
buyUpgrade('study-1');
check('two upgrades stack to x4', payoffMult('study') === 4);

// Upgrades tab renders groups and buy buttons
selectTab('upgrades');
check('upgrades panel renders group', el('activity-panel').innerHTML.includes('Study'));
check('upgrades panel shows purchased', el('activity-panel').innerHTML.includes('✓ Purchased'));
check('upgrades panel gates by level', el('activity-panel').innerHTML.includes('Requires Lv 25'));

// Purchases survive a save/load round-trip; unknown ids are dropped
saveGame();
S.upgrades = {};
loadGame();
check('save restores upgrades', S.upgrades['study-0'] && S.upgrades['study-1']);
applySave({ upgrades: { 'study-0': true, 'bogus-99': true } });
check('legacy/bogus upgrade ids dropped', S.upgrades['study-0'] === true && !S.upgrades['bogus-99']);

// --- Total Level & Spheres ---
// (study is at lv 10 from the upgrade tests; everything else at 0)
check('total level sums skill levels', totalLevel() === 10);
check('spheres locked below total level 30', !isSkillUnlocked('spheres'));
check('sidebar hides spheres tab while locked', !el('skill-sidebar').innerHTML.includes('Spheres'));

S.skills.prepare.lv = 20; // total level 30
checkUnlocks();
check('spheres unlock at total level 30', isSkillUnlocked('spheres'));
check('sidebar shows spheres tab', el('skill-sidebar').innerHTML.includes('Spheres'));
check('exp equals total level before spending', expAvail() === 30);

// Cost curve: 5, 5, 10, 15, 20 (max level 5, 55 exp total)
buySphere('forces');
check('level 1 costs 5', S.spheres.forces === 1 && expAvail() === 25);
buySphere('forces');
check('level 2 costs 5', S.spheres.forces === 2 && expAvail() === 20);
buySphere('forces');
check('level 3 costs 10', S.spheres.forces === 3 && expAvail() === 10);
buySphere('forces');
check('cannot afford level 4 (costs 15) with 10 exp', S.spheres.forces === 3);
S.skills.venture.lv = 25; // level-ups grant exp
check('leveling up grants exp', expAvail() === 35);
buySphere('forces');
buySphere('forces');
check('sphere maxes at level 5', S.spheres.forces === 5 && expAvail() === 0);
buySphere('forces');
check('cannot buy past max level', S.spheres.forces === 5);

// Spheres tab renders
selectTab('spheres');
check('spheres panel lists the nine spheres', el('activity-panel').innerHTML.includes('Correspondence') && el('activity-panel').innerHTML.includes('Time'));
check('spheres panel shows available exp', el('activity-panel').innerHTML.includes('EXP available'));
check('spheres panel shows mastered state', el('activity-panel').innerHTML.includes('✓ Mastered'));

// Sphere levels survive a save/load round-trip; bad values are sanitized
saveGame();
S.spheres.forces = 0;
loadGame();
check('save restores sphere levels', S.spheres.forces === 5);
applySave({ spheres: { forces: 99, bogus: 3 } });
check('sphere levels clamp to max', S.spheres.forces === 5);
check('unknown sphere ids dropped', !('bogus' in S.spheres));

// Device module picks up viewport size from stubs
check('device detects desktop width', Device.isDesktop);
check('device body dataset set', document.body.dataset.device === 'desktop');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
