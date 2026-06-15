# 🧙 Mage: The Ascension — Idle ✨

An incremental/idle game inspired by the World of Darkness tabletop RPG **Mage: The Ascension**. 🌑🔮

Play as a newly Awakened mage 🧙‍♂️ navigating occult societies 🕯️, accumulating arcane Knowledge 📚, mastering the nine Spheres of magic 🌀, and eventually achieving **Ascension** 🌟⚡.

## ▶️ Play

Click [here](https://jvdcorrea.github.io/mage-ascension-idle/).

Or download and open `index.html` in any modern browser — no build step required. 🖥️✨

## 📜 Design Document

`Mage The Ascension idle.md` contains the full game design document: mechanics, skills, activities, upgrade tables, progression philosophy, and long-term loop design. 🗺️🧠

## 🧪 Tests

```bash
node test-logic.js
```

The test suite is a headless smoke test that stubs the DOM and exercises unlock logic, cost mechanics, upgrades, save/load, and the Spheres system. ⚗️🔬

## ✨ Features

- 🎓 **Skills & Activities** — Study 📖, Prepare ⚔️, Venture 💰, Network 🤝, Steal 🦹, Investigate 🔍, Explore 🗺️, Fight 🥊, Craft 🔨, Barter 💎, Teach 👨‍🏫, Meditate 🧘
- ⚡ **Setback system** — risky activities can backfire with thematic Paradox flavor text 🌪️💥
- 🏆 **Upgrades** — six tiers per skill, each doubling payoff (up to ×64) 📈
- 🌀 **Nine Spheres** — spend EXP to level Correspondence 🌐, Entropy 💀, Forces ⚡, Life 🌿, Matter 🪨, Mind 🧠, Prime 🔥, Spirit 👻, Time ⏳
- 💀 **Prestige loop** — die and reincarnate for Avatar Points 👁️, multiplicative speed bonuses that collapse later runs 🔄✨
- 🏛️ **Factions** — Traditions 🧙‍♀️, Technocracy 🤖, and Disparates 🌙 (planned)

## 📁 Structure

```
mage-idle.html               🧙 Self-contained game (HTML + CSS + JS)
Mage The Ascension idle.md   📜 Game design document
test-logic.js                🧪 Headless test suite (Node.js)
```

---

*"Reality is a matter of perspective — and sufficient will."* 🔮✨🧙‍♂️
