# Architecture du Jeu Présidentiel Ultra-Réaliste

## 🏗️ Vue d'ensemble

Ce jeu est une simulation politique ultra-complète et réaliste qui combine plusieurs systèmes interconnectés pour créer une expérience immersive et addictive.

## 📦 Systèmes Principaux

### 1. **Moteur Parlementaire** (`src/systems/ParliamentEngine.ts`)

**Caractéristiques:**
- 577 députés individuels générés avec personnalité, traits et historique
- Vote réaliste basé sur:
  - Discipline de parti (variable par député)
  - Convictions idéologiques personnelles
  - Relations avec le gouvernement
  - Négociations et pressions
  - Traits de personnalité (rebelle, fidèle, pragmatique, etc.)
- Système de négociation sophistiqué
- Motions de censure
- Amendements et débats parlementaires

**Types clés:**
- `Deputy`: Député avec 40+ propriétés
- `Law`: Loi avec articles, amendements, effets
- `VotingResults`: Résultats détaillés par député et parti

### 2. **Système d'Opinion Publique** (`src/systems/OpinionEngine.ts`)

**Caractéristiques:**
- 22 segments démographiques différents:
  - Par âge: 18-24, 25-34, 35-49, 50-64, 65+
  - Par catégorie socio-professionnelle: ouvriers, employés, cadres, etc.
  - Par géographie: urbains, périurbains, ruraux, régions
- Propagation d'opinion entre segments (influence sociale)
- Tendances réseaux sociaux avec viralité
- Sondages d'opinion réalistes avec marge d'erreur
- Humeur publique (optimiste, pessimiste, colère, etc.)
- Polarisation et émotions collectives

**Algorithme de propagation:**
```
Opinion(segment) += Σ (Opinion(segment_connecté) - Opinion(segment)) × Influence × 0.05
```

### 3. **Système de Personnages Vivants** (`src/systems/CharacterEngine.ts`)

**Caractéristiques:**
- Personnages avec personnalité complexe:
  - 20 traits de personnalité possibles
  - Motivations hiérarchisées (pouvoir, richesse, idéologie, etc.)
  - Psychologie (intelligence, charisme, intégrité, ambition)
  - Valeurs morales
- Système de relations dynamiques:
  - Types: allié, ami, mentor, rival, ennemi
  - Historique des interactions
  - Dettes et faveurs
  - Secrets partagés
- Secrets et scandales potentiels
- IA comportementale réactive
- Agenda personnel (court, moyen, long terme)

### 4. **Système Médiatique** (`src/systems/MediaEngine.ts`)

**Caractéristiques:**
- 8 médias français réalistes:
  - TF1, France 2, Le Monde, Le Figaro, Libération, BFM TV, Mediapart, Valeurs Actuelles
  - Chacun avec biais politique, audience, crédibilité
- Génération intelligente d'articles basée sur:
  - Ligne éditoriale du média
  - Contexte politique
  - Templates adaptés
- Scandales médiatiques avec cycle de vie
- Campagnes de communication
- Talk shows et débats

### 5. **Moteur Économique** (`src/types/economy.ts`)

**Caractéristiques:**
- 15 secteurs économiques détaillés
- Indicateurs macro-économiques:
  - PIB, chômage, inflation, pouvoir d'achat
  - Dette publique, déficit
  - Balance commerciale
  - Indices de confiance
- Entreprises majeures avec PDG influents
- Inégalités et indicateur de Gini

### 6. **Système Diplomatique** (`src/types/diplomacy.ts`)

**Caractéristiques:**
- Relations bilatérales avec 18 pays majeurs
- Alliances militaires
- Volume d'échanges commerciaux
- Crises internationales avec options

## 🎮 Boucle de Jeu Principale

```
1. Événement se produit
   ↓
2. Médias couvrent l'événement
   ↓
3. Opinion publique réagit (par segment)
   ↓
4. Personnages politiques réagissent (IA)
   ↓
5. Propagation d'opinion entre segments
   ↓
6. Conséquences à long terme
```

## 🔧 Moteur Principal (`MasterGameEngine.ts`)

Le `MasterGameEngine` orchestre tous les sous-systèmes:

- **Initialisation:** Active tous les moteurs en séquence
- **Avancement du temps:** Coordonne les simulations
- **Sauvegarde/Chargement:** Sérialise l'état complet
- **Statistiques globales:** Agrège les données de tous les systèmes

## 📊 Métriques de Gameplay

Le jeu suit des dizaines de métriques:

### Indicateurs Présidentiels
- Popularité globale (pondérée par segment)
- Capital politique (0-200)
- Phase du mandat (lune de miel, gouvernance, mi-mandat, campagne)

### Indicateurs Sociaux
- Agitation sociale (0-100)
- Systèmes de santé, éducation, sécurité
- Demandes sociales avec potentiel de mobilisation

### Indicateurs Politiques
- Stabilité de la coalition
- Majorité parlementaire
- Relations avec l'opposition
- Influence médiatique

## 🎯 Génération Procédurale

### Députés (577)
Générés avec:
- Noms français authentiques
- Âge, profession, expérience
- Idéologie avec variation individuelle (+/- 15 pts par rapport au parti)
- Traits aléatoires (2-4 traits par député)
- Expertises (1-3 domaines)

### Événements
Générés dynamiquement basés sur:
- État de l'opinion publique
- Indicateurs économiques
- Phase du mandat
- Événements précédents (chaînes causales)

### Articles Médiatiques
Générés avec:
- Templates par type (politique, scandale, crise sociale)
- Variation selon biais du média
- Sentiment adapté au contexte

## 🧠 Intelligence Artificielle

### IA des Députés
Calcul probabiliste du vote:
```
P(pour) = f(discipline, idéologie, relation_gouv, négociations, traits)
```

Facteurs:
- Discipline de parti: 10-95%
- Distance idéologique: importante
- Traits (rebelle: -30%, fidèle: +20%)
- Négociations: +40% si deal accepté

### IA des Personnages
Chaque personnage évalue:
1. **Menaces** (qui menace ma position?)
2. **Opportunités** (comment progresser?)
3. **Relations** (qui renforcer/affaiblir?)
4. **Stratégie** (ajuster l'approche)

Puis choisit une action selon sa personnalité.

### IA Médiatique
Génération d'articles basée sur:
1. Agenda médiatique (sujets prioritaires)
2. Ligne éditoriale
3. Événements récents
4. Campagnes en cours

## 📈 Système de Progression

### Réputation Présidentielle
Évaluée sur 5 dimensions:
- **Leader politique** (capacité à faire passer des réformes)
- **Gestionnaire économique** (santé de l'économie)
- **Leader international** (influence mondiale)
- **Unificateur** (capacité à rassembler)
- **Réformateur** (ampleur des changements)

### Héritage
À la fin du mandat:
- Classement parmi les présidents français
- Réformes marquantes
- Moments emblématiques
- Impact à long terme

## 🔄 Cycles de Jeu

### Cycle Court (1 heure de jeu)
- Événements mineurs
- Articles médiatiques
- Réactions des personnages
- Évolution naturelle de l'opinion

### Cycle Moyen (1 jour de jeu)
- Sondages d'opinion
- Débats parlementaires
- Événements majeurs
- Mise à jour des statistiques

### Cycle Long (1 semaine de jeu)
- Réformes majeures
- Crises politiques
- Scandales
- Évolution des alliances

## 🎨 Recommandations d'Implémentation UI

### Tableau de Bord Principal
- **Centre**: Indicateurs clés en temps réel
- **Gauche**: Flux d'événements et notifications
- **Droite**: Agenda présidentiel
- **Bas**: Tendances médiatiques et réseaux sociaux

### Écran Parlementaire
- Hémicycle avec 577 députés (points colorés par parti)
- Prévision de vote en temps réel
- Interface de négociation avec députés clés
- Graphiques de discipline de parti

### Écran Opinion
- Carte de France avec satisfaction par région
- Graphiques par segment démographique
- Propagation d'opinion visualisée (flux animés)
- Tendances réseaux sociaux

### Écran Médias
- Flux d'articles en temps réel
- Nuages de mots des sujets dominants
- Graphique de sentiment médiatique
- Interface de gestion de crise médiatique

## 🚀 Performances

**Optimisations implémentées:**
- Limitation des historiques (100-200 derniers items)
- Calculs différés pour IA
- Memoization des calculs coûteux
- Zustand pour state management performant

**Charge CPU estimée:**
- 577 députés: ~5ms par vote
- 22 segments d'opinion: ~2ms par propagation
- Génération d'article: ~1ms
- Total par heure de jeu simulée: ~10-20ms

## 📚 Pour Aller Plus Loin

### Extensions Possibles
1. **Système judiciaire** (scandales, procès)
2. **Référendums** avec campagnes
3. **Élections européennes** simulées
4. **Attentats et crises sécuritaires**
5. **Pandémies** avec gestion sanitaire
6. **Grèves nationales** avec négociations
7. **Manifestations** avec risque de débordement
8. **Conseil constitutionnel** (censure de lois)
9. **Sénateurs** (349 sénateurs avec votes)
10. **Partis politiques** avec congrès internes

### Moddabilité
Tous les systèmes utilisent des données JSON/TypeScript facilement modifiables:
- `data/events.json`: Événements scénarisés
- `src/data/deputyGenerator.ts`: Génération de députés
- `src/types/`: Tous les types sont extensibles

## 🎓 Réalisme Historique

Le jeu s'inspire de:
- **Vraies données**: Répartition des sièges 2024, médias réels
- **Mécanismes réels**: 49.3, motion de censure, discipline de vote
- **Personnalités réelles**: Traits inspirés de politiciens français
- **Événements réels**: Réformes des retraites, crises sociales

## 🏆 Objectif Final

Créer la simulation politique la plus réaliste, complète et addictive jamais créée en offrant:
- **Profondeur stratégique** (négociations, alliances, trahisons)
- **Émergence narrative** (histoires uniques à chaque partie)
- **Authenticité** (mécanismes et données réalistes)
- **Rejouabilité** (systèmes procéduraux, choix multiples)
- **Satisfaction** (feedback immédiat, progression visible)

**Bon mandat, Monsieur le Président ! 🇫🇷**
