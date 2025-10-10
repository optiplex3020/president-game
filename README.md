# 🏛️ President Game — La Simulation Présidentielle Ultra-Réaliste

**La simulation politique la plus complète, réaliste et addictive jamais créée.**

Une simulation présidentielle française révolutionnaire qui combine:
- 🗳️ **577 députés individuels** avec personnalité, idéologie et comportement unique
- 👥 **22 segments démographiques** avec propagation d'opinion réaliste
- 📰 **8 médias français** authentiques avec génération d'articles intelligente
- 🎭 **Personnages vivants** avec relations dynamiques, secrets et ambitions
- 💼 **Économie profonde** avec 15 secteurs et indicateurs macro-économiques
- 🌍 **Diplomatie** avec 18 pays et crises internationales

## Lancer le jeu

- Installer les dépendances: `npm install`
- Démarrer en dev: `npm run dev`

Ouvrez ensuite l’URL affichée par Vite (généralement `http://localhost:5173`).

## Parcours de jeu

- Écran d’initialisation: renseignez vos informations, choisissez votre parti, sélectionnez un(e) Premier/ère ministre via un sélecteur avancé, puis formez un gouvernement réaliste par portefeuilles.
- Tableau de bord: accédez au dashboard présidentiel détaillé avec indicateurs (popularité, économie, social, international), agenda, veille médias et centre d’événements interactif.
- Événements: des événements dynamiques et scénarisés offrent des décisions avec coûts/effets immédiats et retardés (capital politique, popularité, stabilité sociale...).

## 🎮 Fonctionnalités Ultra-Réalistes

### 🗳️ Système Parlementaire Vivant
- **577 députés générés procéduralement** avec nom, âge, profession, région
- **Vote réaliste** basé sur:
  - Discipline de parti (variable par député: 10-95%)
  - Convictions idéologiques personnelles
  - Relations avec le gouvernement (-100 à +100)
  - Négociations et pressions
  - Traits de personnalité (rebelle, fidèle, pragmatique, etc.)
- **Système de négociation** pour convaincre les députés clés
- **Motions de censure**, amendements, débats
- Chaque député a un historique de votes et peut trahir son parti

### 👥 Opinion Publique Multi-Couches
- **22 segments démographiques** détaillés:
  - Par âge: 18-24, 25-34, 35-49, 50-64, 65+
  - Par CSP: ouvriers, employés, cadres, professions libérales, etc.
  - Par géographie: urbains, périurbains, ruraux, régions
- **Propagation d'opinion** entre segments connectés (influence sociale)
- **Tendances réseaux sociaux** avec viralité et amplification médiatique
- **Sondages d'opinion** réalistes avec marge d'erreur
- **Humeur publique** (optimiste, pessimiste, colère, apaisé)
- **Polarisation** et émotions collectives mesurées

### 🎭 Personnages Politiques Vivants
- **Personnalité complexe**: 20 traits possibles (ambitieux, loyal, opportuniste, etc.)
- **Motivations hiérarchisées**: pouvoir, richesse, idéologie, nation
- **Psychologie détaillée**: intelligence, charisme, intégrité, ambition
- **Système de relations dynamiques**:
  - Types: allié, ami, mentor, rival, ennemi
  - Historique complet des interactions
  - Dettes et faveurs
  - Secrets partagés
- **Secrets et scandales** avec risque de révélation
- **IA comportementale** réactive selon la personnalité
- **Agenda personnel** à court, moyen et long terme

### 📰 Écosystème Médiatique Réaliste
- **8 médias français authentiques**:
  - TF1, France 2, Le Monde, Le Figaro, Libération
  - BFM TV, Mediapart, Valeurs Actuelles
- Chaque média a:
  - **Biais politique** (extrême-gauche à extrême-droite)
  - **Ligne éditoriale** (qualité, sensationnalisme, indépendance)
  - **Audience** (millions de lecteurs/téléspectateurs)
  - **Crédibilité** et rigueur fact-checking
- **Génération intelligente d'articles** basée sur:
  - Contexte politique actuel
  - Biais du média
  - Templates adaptatifs
- **Scandales médiatiques** avec cycle de vie
- **Campagnes de communication**

### 💼 Économie Profonde
- **15 secteurs économiques** simulés (agriculture, industrie, services, tech, etc.)
- **Indicateurs macro-économiques**:
  - PIB, chômage, inflation, pouvoir d'achat
  - Dette publique, déficit budgétaire
  - Balance commerciale
  - Indices de confiance (entreprises, consommateurs, investisseurs)
- **Inégalités** mesurées (coefficient de Gini, part des 10% les plus riches)
- **Entreprises majeures** avec PDG influents

### 🌍 Diplomatie Internationale
- **18 pays majeurs** avec relations bilatérales
- **Relations** évolutives (-100 à +100)
- **Volume d'échanges** commerciaux (milliards €)
- **Alliances militaires** (OTAN, UE)
- **Crises internationales** avec options diplomatiques
- **Sommets** et négociations internationales

## 🔧 Architecture Technique

### Moteurs de Jeu

#### `MasterGameEngine.ts` — Orchestrateur Principal
Coordonne tous les sous-systèmes et gère:
- Initialisation globale
- Avancement du temps coordonné
- Sauvegarde/Chargement de parties
- Statistiques globales agrégées

#### `ParliamentEngine.ts` — Moteur Parlementaire
- Génération des 577 députés
- Calcul probabiliste des votes
- Système de négociation
- Gestion des motions de censure
- Débats et amendements

#### `OpinionEngine.ts` — Moteur d'Opinion
- Simulation de 22 segments démographiques
- Propagation d'opinion (influence sociale)
- Génération de sondages
- Tendances réseaux sociaux
- Humeur publique et polarisation

#### `CharacterEngine.ts` — Moteur de Personnages
- Personnalités avec traits et motivations
- Système de relations dynamiques
- Secrets et scandales
- IA comportementale
- Actions politiques (alliances, trahisons, déclarations)

#### `MediaEngine.ts` — Moteur Médiatique
- 8 médias français réalistes
- Génération intelligente d'articles
- Scandales avec cycle de vie
- Campagnes de communication

### Types Détaillés

- `src/types/parliament.ts` — Députés, lois, votes, négociations
- `src/types/opinion.ts` — Segments démographiques, sondages, tendances
- `src/types/characters.ts` — Personnalités, relations, secrets, actions
- `src/types/media.ts` — Médias, articles, scandales, campagnes
- `src/types/economy.ts` — Secteurs, indicateurs, entreprises
- `src/types/diplomacy.ts` — Pays, relations, crises internationales

## 📊 Mécaniques de Gameplay

### Boucle de Jeu
```
1. Événement politique se produit
2. Médias couvrent avec leur biais
3. Opinion publique réagit (par segment)
4. Personnages politiques agissent (IA)
5. Propagation d'opinion entre segments
6. Conséquences à moyen/long terme
```

### Système de Vote Parlementaire
```
P(député vote POUR) = f(
  discipline_parti,          // 10-95%
  distance_idéologique,       // Très important
  relation_gouvernement,      // -100 à +100
  traits_personnalité,        // Rebelle: -30%, Fidèle: +20%
  négociations_en_cours,      // +40% si deal accepté
  expertise_sujet             // +15% si expert du domaine
)
```

### Propagation d'Opinion
```
Opinion(segment) += Σ (Opinion(segment_connecté) - Opinion(segment)) × Influence × 0.05
```

Chaque segment a des **connexions** avec d'autres (ex: jeunes 18-24 → étudiants: 85%)

## 🎯 Objectifs de Gameplay

### Court terme
- Faire passer des réformes à l'Assemblée
- Gérer les crises médiatiques
- Maintenir la majorité
- Négocier avec les députés clés

### Moyen terme
- Construire une coalition stable
- Gérer l'opinion publique
- Éviter les scandales
- Réformer le pays

### Long terme
- Laisser un héritage présidentiel
- Être réélu ou assurer une succession
- Être classé parmi les grands présidents
- Transformer durablement la France

## 📚 Documentation Complète

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Architecture détaillée des systèmes
- **[src/types/](src/types/)** — Documentation TypeScript complète
- **[src/systems/](src/systems/)** — Code commenté des moteurs de jeu

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
npm run dev
```

### Initialisation du Jeu
```typescript
import { useMasterGameEngine } from './src/systems/MasterGameEngine';

const game = useMasterGameEngine();
game.initializeGame();

// Le jeu génère automatiquement:
// ✅ 577 députés avec personnalité
// ✅ 22 segments d'opinion publique
// ✅ Personnages politiques clés
// ✅ 8 médias français
```

### Avancer le Temps
```typescript
game.advanceTime(24); // Avancer de 24 heures

// Cette action déclenche:
// - Simulation de l'opinion publique
// - Cycle médiatique (génération d'articles)
// - Actions des personnages (IA)
// - Événements aléatoires
```

### Faire Voter une Loi
```typescript
import { useParliamentEngine } from './src/systems/ParliamentEngine';

const parliament = useParliamentEngine();

const law = {
  id: 'law_retraites_2024',
  title: 'Réforme des retraites',
  category: 'social',
  requiredMajority: 'absolue', // 289 voix
  ideology: { economicLeft: 40, social: -20, ... },
  // ...
};

parliament.proposeLaw(law);
const results = await parliament.simulateVote(law.id);

console.log(`Pour: ${results.pour}`);
console.log(`Contre: ${results.contre}`);
console.log(`Loi ${results.passed ? 'ADOPTÉE' : 'REJETÉE'}`);
console.log(`Rebelles: ${results.rebels.length} députés`);
```

### Négocier avec un Député
```typescript
const deputyId = 'deputy_42';
const offer = {
  id: 'nego_1',
  targetDeputy: parliament.getDeputy(deputyId),
  offeredBy: 'prime_minister',
  offer: {
    type: 'commission',
    description: 'Président de la commission des finances',
    value: 70
  },
  demand: {
    vote: 'pour',
    lawId: 'law_retraites_2024'
  },
  status: 'pending'
};

const accepted = await parliament.negotiateWithDeputy(deputyId, offer);
console.log(accepted ? '✅ Député convaincu' : '❌ Négociation échouée');
```

## 🎨 Composants React

### Composants Existants
- `InitGameScreen.tsx` — Initialisation du jeu (parti, PM, cabinet)
- `PresidentialDashboard.tsx` — Tableau de bord principal
- `InteractiveGameSystem.tsx` — Système d'événements interactifs

### Composants à Créer (Recommandés)
- `ParliamentView.tsx` — Hémicycle avec 577 députés
- `OpinionDashboard.tsx` — Carte de France + segments
- `MediaFeed.tsx` — Flux d'articles en temps réel
- `CharacterRelationsGraph.tsx` — Graph des relations politiques
- `NegotiationInterface.tsx` — Interface de négociation avec députés
- `ScandalManager.tsx` — Gestion des scandales médiatiques

## 🔥 Fonctionnalités Addictives

### Émergence Narrative
Chaque partie raconte une histoire unique grâce à:
- Génération procédurale d'événements
- IA des personnages créant des intrigues
- Scandales émergents
- Trahisons et alliances imprévisibles

### Profondeur Stratégique
- Négociations multi-niveaux (députés, partis, médias)
- Gestion du capital politique
- Arbitrages difficiles (popularité vs. réformes)
- Conséquences à long terme

### Feedback Immédiat
- Impact instantané sur l'opinion publique
- Réactions des personnages en temps réel
- Articles médiatiques générés
- Visualisations dynamiques

### Progression Satisfaisante
- Déblocage de réformes majeures
- Construction d'un héritage
- Classement historique
- Achievements (accomplissements)

## 🏆 Réalisme et Authenticité

### Données Réelles
- Répartition des sièges 2024 de l'Assemblée Nationale
- 8 médias français authentiques avec vraies lignes éditoriales
- Mécanismes constitutionnels réels (49.3, motion de censure)

### Comportements Réalistes
- Discipline de parti variable (ex: LREM 70%, RN 85%, LIOT 45%)
- Biais médiatiques vérifiés
- Propagation d'opinion basée sur recherches sociologiques

### Événements Inspirés du Réel
- Réformes des retraites
- Crises sociales (gilets jaunes, grèves)
- Scandales politiques
- Crises internationales

## 🛠️ Extensions Futures

- [ ] **Système judiciaire** (scandales, procès, condamnations)
- [ ] **Référendums** avec campagnes
- [ ] **Élections européennes** simulées
- [ ] **Attentats** et crises sécuritaires
- [ ] **Pandémies** avec gestion sanitaire
- [ ] **Grèves nationales** sectorielles
- [ ] **Manifestations** avec risques de débordement
- [ ] **Conseil constitutionnel** (censure de lois)
- [ ] **Sénat** (349 sénateurs avec navette parlementaire)
- [ ] **Partis politiques** avec congrès internes

## 📖 Licence et Contributions

Projet open-source. Contributions bienvenues !

## 🎓 Crédits

Inspiré de :
- **Democracy 3/4** (simulation politique)
- **Tropico** (gestion de pays)
- **Reigns** (choix avec conséquences)
- **La vraie vie politique française** (réalisme)

---

**Bon mandat, Monsieur le Président ! 🇫🇷**
