import { create } from 'zustand';
import type {
  MediaOutlet,
  Article,
  MediaEcosystem,
  MediaScandal,
  TalkShow,
  MediaCampaign,
  MediaBias
} from '../types/media';

interface MediaEngineState extends MediaEcosystem {
  // Actions
  initializeMedia: () => void;
  generateArticle: (params: {
    topic: string;
    sentiment?: number;
    relatedCharacters?: string[];
    relatedEvents?: string[];
    outletId?: string;
  }) => Article;
  publishArticle: (article: Article) => void;
  launchMediaCampaign: (campaign: MediaCampaign) => void;
  triggerScandal: (scandal: MediaScandal) => void;
  simulateMediaCycle: (hoursElapsed: number) => void;
  getOutletsByBias: (bias: MediaBias) => MediaOutlet[];
  getMostInfluentialOutlets: (count: number) => MediaOutlet[];
  getRecentArticles: (count: number) => Article[];
}

const FRENCH_MEDIA_OUTLETS: Record<string, MediaOutlet> = {
  'tf1': {
    id: 'tf1',
    name: 'TF1',
    type: 'television',
    editorialLine: { bias: 'center_right', quality: 65, sensationalism: 60, independence: 55 },
    audience: { daily: 8500000, weekly: 25000000, demographics: [] },
    influence: { political: 75, public: 85, media: 70 },
    credibility: { overall: 65, factChecking: 60, reputationScore: 70 },
    owner: { name: 'Groupe TF1', type: 'private', politicalAffiliation: 'center_right' },
    focusAreas: ['politique', 'faits_divers', 'sport', 'divertissement'],
    publicationFrequency: 'real_time'
  },
  'france2': {
    id: 'france2',
    name: 'France 2',
    type: 'television',
    editorialLine: { bias: 'center', quality: 75, sensationalism: 40, independence: 70 },
    audience: { daily: 7200000, weekly: 22000000, demographics: [] },
    influence: { political: 80, public: 80, media: 75 },
    credibility: { overall: 75, factChecking: 80, reputationScore: 78 },
    owner: { name: 'France Télévisions', type: 'state' },
    focusAreas: ['politique', 'culture', 'societe', 'international'],
    publicationFrequency: 'real_time'
  },
  'le_monde': {
    id: 'le_monde',
    name: 'Le Monde',
    type: 'press',
    editorialLine: { bias: 'center_left', quality: 90, sensationalism: 20, independence: 85 },
    audience: { daily: 450000, weekly: 2500000, demographics: [] },
    influence: { political: 95, public: 70, media: 90 },
    credibility: { overall: 90, factChecking: 95, reputationScore: 92 },
    owner: { name: 'Groupe Le Monde', type: 'private', politicalAffiliation: 'center_left' },
    focusAreas: ['politique', 'economie', 'international', 'societe'],
    publicationFrequency: 'daily'
  },
  'le_figaro': {
    id: 'le_figaro',
    name: 'Le Figaro',
    type: 'press',
    editorialLine: { bias: 'right', quality: 80, sensationalism: 30, independence: 65 },
    audience: { daily: 320000, weekly: 2000000, demographics: [] },
    influence: { political: 85, public: 65, media: 80 },
    credibility: { overall: 80, factChecking: 85, reputationScore: 82 },
    owner: { name: 'Dassault', type: 'private', politicalAffiliation: 'right' },
    focusAreas: ['politique', 'economie', 'culture', 'opinion'],
    publicationFrequency: 'daily'
  },
  'liberation': {
    id: 'liberation',
    name: 'Libération',
    type: 'press',
    editorialLine: { bias: 'left', quality: 75, sensationalism: 45, independence: 75 },
    audience: { daily: 180000, weekly: 1200000, demographics: [] },
    influence: { political: 70, public: 60, media: 70 },
    credibility: { overall: 75, factChecking: 80, reputationScore: 75 },
    owner: { name: 'Altice Media', type: 'private' },
    focusAreas: ['politique', 'societe', 'culture', 'environnement'],
    publicationFrequency: 'daily'
  },
  'bfmtv': {
    id: 'bfmtv',
    name: 'BFM TV',
    type: 'television',
    editorialLine: { bias: 'center_right', quality: 60, sensationalism: 75, independence: 50 },
    audience: { daily: 3500000, weekly: 15000000, demographics: [] },
    influence: { political: 70, public: 75, media: 65 },
    credibility: { overall: 60, factChecking: 55, reputationScore: 58 },
    owner: { name: 'Altice', type: 'private' },
    focusAreas: ['politique', 'economie', 'breaking_news'],
    publicationFrequency: 'real_time'
  },
  'mediapart': {
    id: 'mediapart',
    name: 'Mediapart',
    type: 'online',
    editorialLine: { bias: 'left', quality: 85, sensationalism: 30, independence: 95 },
    audience: { daily: 200000, weekly: 800000, demographics: [] },
    influence: { political: 85, public: 55, media: 80 },
    credibility: { overall: 85, factChecking: 90, reputationScore: 88 },
    owner: { name: 'Indépendant', type: 'cooperative' },
    focusAreas: ['investigation', 'politique', 'corruption', 'justice'],
    publicationFrequency: 'daily'
  },
  'valeurs_actuelles': {
    id: 'valeurs_actuelles',
    name: 'Valeurs Actuelles',
    type: 'press',
    editorialLine: { bias: 'extreme_right', quality: 50, sensationalism: 70, independence: 60 },
    audience: { daily: 80000, weekly: 500000, demographics: [] },
    influence: { political: 50, public: 40, media: 45 },
    credibility: { overall: 45, factChecking: 40, reputationScore: 42 },
    owner: { name: 'Valmonde', type: 'private', politicalAffiliation: 'extreme_right' },
    focusAreas: ['politique', 'immigration', 'securite', 'identite'],
    publicationFrequency: 'weekly'
  }
};

const ARTICLE_TEMPLATES = {
  politique_decision: {
    headlines: [
      '{gouvernement} annonce {decision}',
      '{president}: "{citation}"',
      '{decision}: {opposition} monte au créneau',
      'Polémique autour de {decision}',
      '{decision}: ce qui va changer pour les Français'
    ],
    intros: [
      'Le gouvernement a annoncé aujourd\'hui {decision}. Une décision qui suscite déjà de vives réactions.',
      '{president} a dévoilé ce matin {decision}, marquant un tournant dans sa politique {domaine}.',
      'Attendue depuis plusieurs mois, {decision} vient d\'être officialisée par {gouvernement}.'
    ]
  },
  crise_sociale: {
    headlines: [
      'Grève générale: la France paralysée',
      '{syndicat} appelle à la mobilisation',
      'Manifestations: {nombre} personnes dans les rues',
      'Tensions sociales: {gouvernement} sous pression'
    ],
    intros: [
      'Des milliers de manifestants ont défilé aujourd\'hui dans toute la France pour protester contre {cause}.',
      'Le mouvement social s\'amplifie. {syndicat} annonce la reconduction de la grève.',
      'Face à la mobilisation, {gouvernement} temporise et appelle au dialogue.'
    ]
  },
  scandale: {
    headlines: [
      'Révélations: {personne} dans la tourmente',
      'Scandale: {personne} mis en cause',
      '{personne}: les dessous d\'une affaire qui secoue {institution}',
      'Affaire {nom}: nouvelles révélations accablantes'
    ],
    intros: [
      'Selon nos informations, {personne} serait impliqué dans {affaire}.',
      'C\'est un scandale qui éclabousse {institution}. {personne} est accusé de {accusation}.',
      'Les révélations se multiplient dans l\'affaire {nom}. {personne} nie en bloc.'
    ]
  }
};

export const useMediaEngine = create<MediaEngineState>((set, get) => ({
  outlets: FRENCH_MEDIA_OUTLETS,
  articles: [],
  campaigns: [],
  scandals: [],
  talkShows: {},
  currentNarratives: [],
  mediaAgenda: [],

  initializeMedia: () => {
    // Initialisation déjà faite via outlets
    set({
      outlets: FRENCH_MEDIA_OUTLETS,
      mediaAgenda: [
        { topic: 'Réforme des retraites', priority: 90, coverage: 0, sentiment: -20 },
        { topic: 'Pouvoir d\'achat', priority: 85, coverage: 0, sentiment: -30 },
        { topic: 'Climat', priority: 70, coverage: 0, sentiment: -10 }
      ]
    });
  },

  generateArticle: (params) => {
    const state = get();
    const outlet = params.outletId
      ? state.outlets[params.outletId]
      : Object.values(state.outlets)[Math.floor(Math.random() * Object.keys(state.outlets).length)];

    // Choisir un template
    const templates = Object.values(ARTICLE_TEMPLATES);
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Générer le titre
    const headline = template.headlines[Math.floor(Math.random() * template.headlines.length)]
      .replace('{decision}', params.topic)
      .replace('{gouvernement}', 'le gouvernement')
      .replace('{president}', 'le Président')
      .replace('{opposition}', 'l\'opposition');

    // Calculer le sentiment basé sur le biais du média
    const baseSentiment = params.sentiment || 0;
    const biasModifier = {
      'extreme_left': -30,
      'left': -15,
      'center_left': -5,
      'center': 0,
      'center_right': 5,
      'right': 15,
      'extreme_right': 30
    }[outlet.editorialLine.bias] || 0;

    const finalSentiment = Math.max(-100, Math.min(100, baseSentiment + biasModifier));

    const article: Article = {
      id: `article_${Date.now()}_${Math.random()}`,
      mediaOutletId: outlet.id,
      date: new Date(),
      headline,
      content: `Article sur ${params.topic}. Le gouvernement a annoncé une nouvelle mesure qui suscite de vives réactions. L'opposition critique cette décision tandis que la majorité la défend.`,
      wordCount: 500 + Math.floor(Math.random() * 500),
      author: {
        name: 'Jean Dupont',
        specialty: 'Politique',
        reputation: 60 + Math.random() * 30
      },
      category: 'politique',
      tags: [params.topic, 'gouvernement', 'France'],
      tone: outlet.editorialLine.sensationalism > 60 ? 'sensationnaliste' : 'factuel',
      sentiment: {
        overall: finalSentiment > 20 ? 'positif' : finalSentiment < -20 ? 'negatif' : 'neutre',
        towardsGovernment: finalSentiment,
        towardsPresident: finalSentiment - 5,
        towardsOpposition: -finalSentiment / 2
      },
      mainSubject: params.topic,
      secondarySubjects: [],
      mentionedCharacters: params.relatedCharacters || [],
      relatedEvents: params.relatedEvents || [],
      relatedDecisions: [],
      factuality: {
        verifiedFacts: Math.floor(outlet.credibility.factChecking / 10),
        unverifiedClaims: Math.floor((100 - outlet.credibility.factChecking) / 20),
        falseInfo: outlet.editorialLine.quality < 50 ? Math.floor(Math.random() * 3) : 0,
        factCheckScore: outlet.credibility.factChecking
      },
      reach: {
        views: Math.floor(outlet.audience.daily * (0.1 + Math.random() * 0.3)),
        shares: 0,
        comments: 0,
        viralityScore: Math.random() * 60
      },
      publicReaction: {
        positive: 30 + Math.random() * 20,
        negative: 30 + Math.random() * 20,
        neutral: 20 + Math.random() * 20
      },
      politicalReactions: [],
      opinionImpact: []
    };

    return article;
  },

  publishArticle: (article) => {
    set(state => ({
      articles: [...state.articles.slice(-200), article]
    }));
  },

  launchMediaCampaign: (campaign) => {
    set(state => ({
      campaigns: [...state.campaigns, campaign]
    }));
  },

  triggerScandal: (scandal) => {
    set(state => ({
      scandals: [...state.scandals, scandal]
    }));
  },

  simulateMediaCycle: (hoursElapsed) => {
    const state = get();

    // Générer de nouveaux articles selon l'agenda médiatique
    const articlesToGenerate = Math.floor(hoursElapsed / 4); // 1 article toutes les 4 heures

    for (let i = 0; i < articlesToGenerate; i++) {
      const topic = state.mediaAgenda[Math.floor(Math.random() * state.mediaAgenda.length)];
      if (topic) {
        const article = get().generateArticle({
          topic: topic.topic,
          sentiment: topic.sentiment
        });
        get().publishArticle(article);
      }
    }

    // Mettre à jour les couvertures
    set(state => ({
      mediaAgenda: state.mediaAgenda.map(item => ({
        ...item,
        coverage: item.coverage + articlesToGenerate
      }))
    }));
  },

  getOutletsByBias: (bias) => {
    return Object.values(get().outlets).filter(o => o.editorialLine.bias === bias);
  },

  getMostInfluentialOutlets: (count) => {
    return Object.values(get().outlets)
      .sort((a, b) => b.influence.political - a.influence.political)
      .slice(0, count);
  },

  getRecentArticles: (count) => {
    return get().articles.slice(-count);
  }
}));
