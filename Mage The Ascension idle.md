# Mage: The Ascension — Idle Game Design Document

---

## Visão Geral

Mage: The Ascension Idle é um jogo incremental onde o jogador é um mago que clica para navegar pelo jogo e realizar atividades, aumentando seu poder, conhecimento e recursos ao longo do tempo.

---

## Mecânicas Fundamentais

### Atividades

Realizar atividades é o núcleo do jogo. Para realizar uma atividade, basta clicar no retângulo da atividade e esperar o tempo que ela requer. Quando completa, ela automaticamente se reinicia, a não ser que algum requisito impeça. Ao completar, o jogador recebe as recompensas daquela atividade.

**O jogador só pode realizar uma atividade por vez.**

Balanceamento
A primeira atividade tem sempre os seguintes atributos
	Recompensa: 1/s × eff (pago quando terminar a duraçao)
	Tempo de duração: 5s × eff
eff por padrão é 1

Em atividades de setback, a chance é ((40 × risk)- skillLevel)%
O setback é de 3 × risk segundos.
risk por padrão é 1
multiplique risk no calculo da recompensa.

Mais tarde especificarei qual é o eff e risk de cada atividade. Se eu não especificar risk, não é uma atividade de setback.

#### Setbacks

Algumas atividades são arriscadas e podem gerar um **setback** ao ser completadas. Quando isso ocorre, o jogador fica travado em um estado de recuperação por um período de tempo — o mago está se recuperando de um problema recente (com flavor text temático de Paradoxo para atividades mágicas). **Durante a recuperação, o jogador não pode realizar nenhuma atividade.**

Cada atividade possui um valor base de probabilidade de setback, que pode ser modificado por:
- Nível da skill correspondente
- Equipamentos
- Upgrades e unlocks

A duração do tempo de recuperação é reduzida por:
- Equipamentos de proteção (armaduras melhores)
- Pontos na Esfera da **Vida**
- Outras variáveis a definir

### Upgrades

Upgrades são melhorias permanentes compradas com recursos. Podem melhorar recompensas e velocidade de atividades, ou desbloquear novas partes do jogo.

### Unlocks

Unlocks são melhorias ou novas mecânicas que se desbloqueiam quando o jogador atinge certos pré-requisitos.

---

## Recursos

| Recurso | Descrição |
|---|---|
| **Knowledge** | Conhecimento arcano acumulado pelo jogador. |
| **Money** | Dinheiro mundano. |
| **Power** | Poder de combate e preparo. Magos lutam através de estudo e preparação sobre seus oponentes — pode ser gasto. |
| **Quintessence** | Recurso raro usado em upgrades e Enchant poderosos. |
| **Renown** | O quão famoso e respeitado é o mago. Desbloqueia coisas. Obtido principalmente através de Fight. |

---

## Skills

Skills servem a dois propósitos ao mesmo tempo: são um **valor numérico** (nível de proficiência) e uma **aba com atividades**. Quanto maior o nível da skill, mais rápido o jogador executa suas atividades e mais recompensas recebe. Ao clicar em uma skill, é possível ver todas as suas atividades.

As skills são divididas internamente em **Básicas**, **Primárias** e **Secundárias** — essa divisão não é visível para o jogador. O jogador começa com as Básicas e vai desbloqueando as demais conforme progride.

### Total Level, EXP e Esferas *(implementado)*

O **Total Level** é a soma de todos os níveis de skill do jogador, visível no header.

Cada level up de skill concede **1 EXP** — então o EXP total ganho é igual ao Total Level. EXP é gasto nas **9 Esferas** (Correspondence, Entropy, Forces, Life, Matter, Mind, Prime, Spirit, Time), na aba **Spheres**, que desbloqueia ao atingir **Total Level 30**.

Cada Esfera vai do nível 0 ao **5**. O primeiro nível custa 5 EXP e os seguintes custam 5 × nível atual: **5, 5, 10, 15, 20** (55 EXP para maximizar uma Esfera). Por enquanto as Esferas não têm efeito mecânico — os efeitos (atividades gated por Esfera, bônus, etc.) virão depois.

### Básicas *(sem pré-requisitos)*

| Skill | Função | Risco |
|---|---|---|
| **Study** | Adquirir Knowledge | — |
| **Prepare** | Adquirir Power | — |
| **Venture** | Adquirir Money | — |
| **Network** | Adquirir Renown (menos eficiente que Fight) | — |
| **Steal** | Adquirir Money | Pode gerar setback |
| **Investigate** | Adquirir Knowledge | Pode gerar setback |
| **Explore** | Adquirir Power | Pode gerar setback |

### Primárias *(requerem algo das Básicas)*

| Skill | Função |
|---|---|
| **Fight** | Utiliza Power para adquirir Renown |
| **Craft** | Utiliza Money para criar itens |
| **Barter** | Utiliza Money para gerar Quintessence |

### Secundárias *(requerem algo das Primárias)*

| Skill | Função |
|---|---|
| **Teach** | Utiliza Renown para recrutar e treinar Aprendizes |
| **Enchant** | Utiliza itens e Quintessence para criar itens mágicos |

### Arcanas *(requerem pontos em uma Esfera específica)*

| Skill | Função | Requisito |
|---|---|---|
| **Meditate** | Adquirir Quintessence por meios mágicos | Prime 1 |

---

## Itens

Existem três categorias de itens:

- **Equipamentos:** Dão buffs passivos ao jogador enquanto equipados (ex: armaduras reduzem tempo de setback).
- **Consumíveis:** Itens de uso único com efeitos variados.
- **Materiais:** Servem como base para a criação de itens mágicos via Enchant.

Itens comuns são criados pela skill **Craft**. Itens mágicos são criados pela skill **Enchant**, que combina materiais com Quintessence.

---

## Aprendizes

Aprendizes são recrutados e treinados através da skill **Teach**. Eles servem a dois propósitos:

1. **Executar atividades autonomamente:** Quando disponíveis, aprendizes realizam atividades por conta própria a uma fração da velocidade do jogador, em paralelo com a atividade do jogador. Eles ficam mais poderosos conforme o jogador fica mais poderoso.
2. **Absorver setbacks:** Quando um setback ocorre, um aprendiz disponível pode sofrer o tempo de recuperação no lugar do jogador. O aprendiz fica travado pelo tempo completo, enquanto o jogador sofre uma versão consideravelmente mais rápida da recuperação — e pode voltar a agir em seguida.

> ⚠️ **Em aberto:** Quantos aprendizes o jogador pode ter? Eles se especializam em skills específicas ou podem fazer qualquer atividade?

---

## Grupos e Facções

Em algum ponto do jogo, o jogador poderá escolher um **grupo** para se juntar. Cada grupo terá seus próprios benefícios, unlocks e atividades exclusivas. As facções planejadas são:

- **As Nove Tradições Místicas**
    - Akashic Brotherhood
    - Celestial Chorus
    - Cult of Ecstasy
    - Dreamspeakers
    - Euthanatos
    - Order of Hermes
    - Society of Ether
    - Verbena
    - Virtual Adepts
- **As Convenções da Tecnocracia**
    - Iteration X
    - New World Order
    - Progenitors
    - Syndicate
    - Void Engineers
- **Os Disparates** *(talvez)*

> ⚠️ **Em aberto:** Em que momento do jogo ocorre a escolha do grupo — início, meio ou como parte do loop de reencarnação? A escolha de facção **pode ser trocada a cada reencarnação**.

---

## Progressão de Longo Prazo — Avatar e Ascensão

O sistema de **prestige** do jogo é a **morte e reencarnação**.

A reencarnação é **voluntária**: quando o jogador atingir uma parede de progressão e não conseguir mais avançar com facilidade, pode optar por morrer e reencarnar. Ao fazer isso, o progresso do loop atual é resetado e o jogador recebe **Pontos de Avatar** proporcional ao que conquistou.

Os Pontos de Avatar são **multiplicadores passivos cumulativos** — cada reencarnação o personagem começa mais poderoso que o anterior. Ao acumular Avatar suficiente e completar os objetivos dessa árvore, o mago alcança a **Ascensão**, o estado final do jogo.

---

## Filosofia de Pacing e Escala

### Duração do loop

Um loop de reencarnação completo deve durar aproximadamente **10 horas** no primeiro run. O início pode ser propositalmente lento — o jogador está aprendendo o jogo. Loops subsequentes ficam progressivamente mais rápidos graças aos Pontos de Avatar.

### Fases do loop

| Fase | Duração aproximada | O que acontece |
|---|---|---|
| **Início** | ~2h | Jogador aprende as skills básicas, desbloqueia as primárias. Upgrades iniciais desbloqueiam aqui. |
| **Meio** | ~5h | Skills primárias e secundárias em operação. Renown e Quintessence acumulando. Upgrades atuam como válvulas dos chokepoints. |
| **Final** | ~3h | Progressão visivelmente mais lenta. O jogador sente a parede se aproximar. Reencarnação torna-se a saída natural. |

### A parede de progressão

A parede antes da reencarnação deve parecer **intencional e compreensível**, não um bug. O mecanismo: as últimas atividades e níveis de skill têm requisitos tão altos que, sem os multiplicadores de Avatar, o tempo necessário cresce de horas para dias. O jogador entende que não é questão de paciência — é questão de escala.

**Princípio:** os últimos ~20% de progressão do loop devem exigir mais tempo que os primeiros 80% juntos — sem Avatar. Com Avatar suficiente, esses 20% colapsam para uma fração do tempo.

### Pontos de Avatar como multiplicador massivo

Os Pontos de Avatar são a alavanca central do prestige. A escala planejada:

- **Primeiro Avatar point:** ~5x velocidade global
- **Árvore completa:** ~50–100x velocidade global

Isso significa que um loop de 10h no início vira poucos minutos no limite — o arco clássico de prestige que faz o jogador sentir evolução real entre runs.

### Upgrades como parte obrigatória da progressão

Upgrades **não são bônus opcionais** — são parte da progressão. Cada chokepoint deve ter uma "saída" que o jogador precisa descobrir: comprar um upgrade, mudar de atividade, ou investir em outra skill. Isso garante que o jogador sempre tenha algo a fazer e que a progressão pareça um puzzle a resolver, não uma espera passiva.

### Escala das atividades

- **Duração:** cada atividade subsequente demora ~1.5–2x mais que a anterior.
- **Recompensa:** escala levemente acima da duração, tornando atividades mais altas marginalmente mais eficientes — recompensando o investimento em nível.
- **Unlock:** atividades desbloqueiam por nível de skill, com limiares que crescem mais rápido conforme se avança (ex: 0, 5, 15, 30, 50, 75, 105...).
- **Velocidade por nível:** `duração real = duração base / (1 + nível × 0.05)` — nunca zera, sempre há espaço para crescer.
- **XP por conclusão:** proporcional à duração base da atividade. XP necessário por nível cresce exponencialmente (~1.2× por nível).

### Escala dos setbacks (Steal, Investigate, Explore)

- Chance base de setback cresce com a dificuldade da atividade (~3% na atividade 1 → ~20% na atividade 10).
- Nível da skill reduz essa chance gradualmente.
- Duração do setback também escala com a dificuldade — um erro num heist dói mais que um pickpocket errado.

---

## Upgrades Implementados

Cada skill possui 6 upgrades de payoff. Cada upgrade **dobra o payoff** da skill (cumulativo — com todos os 6, o payoff é ×64). Upgrades são comprados com o recurso que a própria skill produz e desbloqueiam ao atingir o nível indicado.

| Tier | Nível requerido | Custo (recurso da skill) | Efeito |
|---|---|---|---|
| 1 | 5 | 50 | ×2 payoff |
| 2 | 10 | 250 | ×2 payoff |
| 3 | 25 | 1.250 | ×2 payoff |
| 4 | 50 | 6.250 | ×2 payoff |
| 5 | 80 | 31.250 | ×2 payoff |
| 6 | 100 | 156.250 | ×2 payoff |

> Nomes placeholder — temáticos por skill, podem ser trocados depois.

| Skill | Lv 5 | Lv 10 | Lv 25 | Lv 50 | Lv 80 | Lv 100 |
|---|---|---|---|---|---|---|
| **Study** | Study Notes | Personal Library | Mnemonic Techniques | Lucid Comprehension | Akashic Recall | Library of the Mind |
| **Prepare** | Training Routine | Quality Gear | Combat Conditioning | Battle Meditation | Warded Equipment | Art of War Mastery |
| **Venture** | Side Hustle | Smart Bookkeeping | Loyal Customers | Market Insight | Diversified Portfolio | Golden Touch |
| **Network** | Business Cards | Charming Smile | Inner Circle | Public Reputation | Influential Friends | Voice of the Consensus |
| **Steal** | Lockpicks | Soft Soles | Fence Contacts | Master Plan | Phantom Hands | Perfect Crime |
| **Investigate** | Notebook and Pen | Police Scanner | Informant Network | Forensic Eye | Pattern Recognition | All-Seeing Web |
| **Explore** | Sturdy Boots | Detailed Maps | Survival Kit | Sixth Sense | Umbral Compass | Walker Between Worlds |
| **Fight** | Fighting Stance | Trophy Collection | Signature Move | Duelist's Honor | Feared Reputation | Legend of the Arena |
| **Barter** | Haggling Basics | Trusted Trader | Rare Goods License | Tass Appraisal | Node Connections | Quintessence Monopoly |

---

## Atividades

### Study
1. Browse occult forums online
2. Read a beginner's occult book
3. Self Study
4. Read Occult Lore
5. Attend a chantry lecture
6. Study under a master
7. Browse Secret Libraries
8. Decode an ancient manuscript
9. Research the secrets of the universe
10. Directly study a Sphere's manifestation

### Prepare
1. Morning exercises
2. Sharpen the tools
3. Practice martial arts
4. Study the enemy
5. Spar with a willing partner
6. Acquire reagents and wards
7. Practice magical arts
8. Study advanced battle tactics
9. Train with martial spirits
10. Embody the art of war
- [Forces 2] Practice Sound to Fire
- [Forces 3] Practice Fireball

### Venture
1. Run errands
2. Work a day job
3. Sell homemade goods
4. Do freelance work
5. Flip goods online
6. Run a small business
7. Run a medium business
8. Run a large business
9. Run a risky business
10. Let the money work for itself
- [Mind 2] Sell expensive stuff
- [Mind 3] Sell seashells on the sea shore
- [Entropy 1] Cheat on day trading
- [Entropy 3] Gamble and win

### Network
1. Make friends at the local bar
2. Volunteer in the community
3. Attend a social gathering
4. Join a professional club
5. Befriend a local journalist
6. Cultivate useful contacts
7. Attend a prestigious event
8. Build a public persona
9. Give a public talk
10. Influence the consensus

### Steal
1. Pickpocket a distracted tourist
2. Shoplift small items
3. Run a small scam
4. Break into a car
5. Con a gullible mark
6. Burgle an empty house
7. Rob a small business
8. Pull a sophisticated con
9. Heist a jewelry store
10. Steal from a heavily guarded vault

### Investigate
1. Follow a rumor
2. Stake out a location
3. Dig through public records
4. Bribe a low-level informant
5. Tail a suspicious person
6. Hack a private network
7. Break into a private archive
8. Infiltrate an organization
9. Intercept encrypted communications
10. Uncover a black site *(Technocrático por padrão; muda para Tradições se o jogador for da Tecnocracia)*

### Explore
1. Scout an unfamiliar neighborhood
2. Explore the city outskirts
3. Enter an abandoned building
4. Venture into the wilderness
5. Navigate a dangerous district
6. Explore underground tunnels
7. Infiltrate a restricted area
8. Investigate a Node site
9. Enter hostile mage territory
10. Cross into the Umbra

### Fight
1. Win a street brawl
2. Defeat a common thug
3. Take down a dangerous criminal
4. Best a trained fighter
5. Defeat a rival mage's apprentice
6. Win a formal magical duel
7. Destroy a supernatural threat
8. Defeat a seasoned mage
9. Dismantle a rival cabal
10. Challenge a fellow Master 

### Craft
*(a definir — terá seu próprio sistema)*

### Barter
1. Trade with a street occultist
2. Buy reagents at a mystic shop
3. Deal in rare herbs and minerals
4. Negotiate with a hedge mage
5. Trade at a local occult market
6. Broker a deal at a chantry bazaar
7. Purchase Node tapping rights
8. Trade with a Tradition merchant
9. Trade with a powerful Prime Mage
10. Control a Quintessence trade hub

### Teach
1. Post a notice at a community board
2. Take on a curious student
3. Teach basic occult theory
4. Guide a student through their first ritual
5. Formally accept an apprentice
6. Train an apprentice in a skill
7. Oversee an apprentice's Awakening
8. Mentor a gifted young mage
9. Establish a study group
10. Found a school of thought

### Meditate
1. Sit in quiet contemplation
2. Breathe and center the self
3. Open the mind to the flow of Prime
4. Attune to a ley line
5. Draw Quintessence from ambient magic
6. Acquire power through sacrifice
7. Channel a Node's energy
8. Enter a deep trance state
9. Commune with the Tellurium
10. Create your own personal Node
