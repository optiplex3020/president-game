# 🚀 Guide de Démarrage Rapide

## Installation et Lancement

```bash
# Installation des dépendances
pnpm install

# Lancement en mode développement
pnpm run dev
```

## Utilisation des Nouveaux Systèmes

### 1. Initialiser le Jeu Complet

```typescript
import { useMasterGameEngine } from './src/systems/MasterGameEngine';

function App() {
  const game = useMasterGameEngine();

  useEffect(() => {
    game.initializeGame();
    // ✅ 577 députés générés
    // ✅ 22 segments d'opinion
    // ✅ Personnages clés
    // ✅ 8 médias
  }, []);

  return <YourGameComponents />;
}
```

### 2. Afficher l'Hémicycle

```typescript
import { ParliamentHemicycle } from './components/ParliamentHemicycle';

<ParliamentHemicycle
  showVotePrediction={true}
  lawId="your_law_id"
  onDeputyClick={(id) => console.log('Député cliqué:', id)}
  highlightedDeputies={['deputy_1', 'deputy_42']}
/>
```

### 3. Afficher l'Opinion Publique

```typescript
import { OpinionMap } from './components/OpinionMap';

<OpinionMap />
```

### 4. Simuler un Vote

```typescript
import { useParliamentEngine } from './src/systems/ParliamentEngine';

const parliament = useParliamentEngine();

// Créer une loi
const law = {
  id: 'law_retraites',
  title: 'Réforme des retraites',
  category: 'social',
  requiredMajority: 'absolue',
  ideology: {
    economicLeft: 40,
    social: -20,
    european: 50,
    environmental: 30,
    authoritarian: 10
  },
  articles: [],
  amendments: [],
  proposedBy: 'gouvernement',
  stage: 'depot'
};

// Proposer la loi
parliament.proposeLaw(law);

// Simuler le vote
const results = await parliament.simulateVote(law.id);

console.log(`Pour: ${results.pour}`);
console.log(`Contre: ${results.contre}`);
console.log(`Loi ${results.passed ? 'ADOPTÉE ✓' : 'REJETÉE ✗'}`);
```

### 5. Négocier avec un Député

```typescript
const deputyId = 'deputy_123';
const deputy = parliament.getDeputy(deputyId);

const offer = {
  id: 'nego_1',
  targetDeputy: deputy,
  offeredBy: 'prime_minister',
  offer: {
    type: 'commission',
    description: 'Président de la commission des finances',
    value: 70
  },
  demand: {
    vote: 'pour',
    lawId: 'law_retraites'
  },
  status: 'pending'
};

const accepted = await parliament.negotiateWithDeputy(deputyId, offer);

if (accepted) {
  console.log('✅ Député convaincu!');
} else {
  console.log('❌ Négociation échouée');
}
```

### 6. Générer des Articles Médiatiques

```typescript
import { useMediaEngine } from './src/systems/MediaEngine';

const media = useMediaEngine();

// Générer un article
const article = media.generateArticle({
  topic: 'Réforme des retraites',
  sentiment: -20, // Négatif
  relatedCharacters: ['pm_001'],
  outletId: 'le_monde'
});

// Publier l'article
media.publishArticle(article);
```

### 7. Suivre l'Opinion Publique

```typescript
import { useOpinionEngine } from './src/systems/OpinionEngine';

const opinion = useOpinionEngine();

// Obtenir l'approbation globale
const approval = opinion.calculateOverallApproval();
console.log(`Approbation: ${approval}%`);

// Obtenir l'opinion d'un segment
const jeunes = opinion.getSegmentOpinion('jeunes_18_24');
console.log(`Confiance des jeunes: ${jeunes.opinion.trustInPresident}%`);

// Déclencher un événement d'opinion
opinion.triggerOpinionEvent({
  id: 'evt_1',
  date: new Date(),
  type: 'decision',
  title: 'Annonce de la réforme',
  description: 'Le gouvernement annonce la réforme des retraites',
  immediateImpact: [
    {
      segment: 'jeunes_18_24',
      trustChange: -5,
      satisfactionChanges: { satisfactionSocial: -10 }
    },
    {
      segment: 'retraites_65_plus',
      trustChange: -15,
      satisfactionChanges: { satisfactionSocial: -20 }
    }
  ],
  decayRate: 0.1,
  mediaAmplification: 80
});
```

### 8. Avancer le Temps

```typescript
const game = useMasterGameEngine();

// Avancer de 24 heures
game.advanceTime(24);

// Cette action déclenche automatiquement:
// - Simulation de l'opinion publique
// - Génération d'articles médiatiques
// - Actions des personnages (IA)
// - Événements aléatoires
```

## Composants React Disponibles

### ✅ Déjà Créés
- `ParliamentHemicycle` — Hémicycle avec 577 députés
- `OpinionMap` — Carte d'opinion avec graphiques
- `MediaFeed` — Flux médiatique en temps réel (à améliorer)

### 🔨 À Créer (Recommandés)
- `DeputyNegotiationInterface` — Interface de négociation
- `EventTimeline` — Timeline des événements
- `LegacyDashboard` — Tableau de bord de réputation
- `CrisisManager` — Gestion des crises
- `CoalitionBuilder` — Construction de coalitions

## Structure des Données

### Député
```typescript
{
  id: 'deputy_1',
  firstName: 'Jean',
  lastName: 'Dupont',
  party: 'renaissance',
  region: 'ile_de_france',
  discipline: 75, // 0-100
  traits: ['pragmatique', 'loyal'],
  ideology: {
    economicLeft: 15,
    social: 40,
    european: 80,
    environmental: 60,
    authoritarian: 20
  }
}
```

### Segment Démographique
```typescript
{
  id: 'jeunes_18_24',
  population: 4.8, // millions
  opinion: {
    trustInPresident: 38,
    satisfactionEconomy: 30,
    satisfactionSocial: 45,
    // ...
  }
}
```

### Article
```typescript
{
  id: 'article_1',
  mediaOutletId: 'le_monde',
  headline: 'Réforme des retraites: le gouvernement prêt à utiliser le 49.3',
  sentiment: {
    overall: 'negatif',
    towardsGovernment: -30,
    towardsPresident: -25
  },
  reach: {
    views: 450000,
    shares: 12000
  }
}
```

## Conseils d'Utilisation

### Optimisation
- Limitez les appels à `advanceTime()` (coûteux en calculs)
- Utilisez `useMemo()` pour les calculs de graphiques
- Les historiques sont limités automatiquement (100-200 items)

### Gameplay
- **Capital politique** = ressource limitée pour négocier
- **Discipline de parti** varie énormément (LREM 70%, LIOT 45%)
- **Opinion publique** se propage entre segments connectés
- **Médias** amplifient l'impact des décisions

### Équilibrage
- Majorité absolue = 289 voix (sur 577)
- Popularité initiale = ~42%
- Capital politique initial = 100/200
- Opinion publique évolue lentement (naturellement)

## Prochaines Étapes

1. **Créer des événements riches** (voir `data/events.json`)
2. **Implémenter l'UI de négociation**
3. **Ajouter des graphiques de tendances** (popularité, économie)
4. **Créer le système de fin de mandat** (bilan, héritage)
5. **Enrichir les personnages** (plus de dialogues, actions)

## Support

- 📖 [ARCHITECTURE.md](ARCHITECTURE.md) — Architecture complète
- 📚 [README.md](README.md) — Documentation générale
- 💻 Code TypeScript entièrement typé et commenté

---

**Bon développement ! 🚀**
