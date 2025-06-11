export const CABINET_ROLES = [
  {
    id: 'premier-ministre',
    title: 'Premier Ministre',
    importance: 100,
    requiredCompetence: 70,
    effects: { stability: 10 }
  },
  {
    id: 'economie',
    title: 'Ministre de l\'Économie',
    importance: 90,
    requiredCompetence: 65,
    effects: { budget: 5, entreprises: 3 }
  },
  {
    id: 'interieur',
    title: 'Ministre de l\'Intérieur',
    importance: 85,
    requiredCompetence: 65,
    effects: { securite: 5 }
  },
    {
        id: 'sante',
        title: 'Ministre de la Santé',
        importance: 80,
        requiredCompetence: 60,
        effects: { sante: 5 }
    },
    {
        id: 'education',
        title: 'Ministre de l\'Éducation',
        importance: 75,
        requiredCompetence: 55,
        effects: { education: 5 }
    },
    {
        id: 'etranger',
        title: 'Ministre des Affaires Étrangères',
        importance: 70,
        requiredCompetence: 60,
        effects: { diplomatie: 5 }
    },
    {
        id: 'justice',
        title: 'Ministre de la Justice',
        importance: 65,
        requiredCompetence: 55,
        effects: { justice: 5 }
    },
    {
        id: 'culture',
        title: 'Ministre de la Culture',
        importance: 60,
        requiredCompetence: 50,
        effects: { culture: 5 }
    },
    {
        id: 'transports',
        title: 'Ministre des Transports',
        importance: 55,
        requiredCompetence: 50,
        effects: { transports: 5 }
    },
    {
        id: 'environnement',
        title: 'Ministre de l\'Environnement',
        importance: 50,
        requiredCompetence: 50,
        effects: { environnement: 5 }
    },
    {
        id: 'agriculture',
        title: 'Ministre de l\'Agriculture',
        importance: 45,
        requiredCompetence: 45,
        effects: { agriculture: 5 }
    },
    {
    id: 'emploi',
    title: 'Ministre du Travail',
    importance: 40,
    requiredCompetence: 45,
    effects: { emploi: 5 }
  },
  {
    id: 'logement',
    title: 'Ministre du Logement',
    importance: 35,
    requiredCompetence: 40,
    effects: { logement: 5 }
  },
  {
    id: 'jeunesse',
    title: 'Ministre de la Jeunesse',
    importance: 30,
    requiredCompetence: 35,
    effects: { jeunesse: 5 }
  },
  {
    id: 'sports',
    title: 'Ministre des Sports',
    importance: 25,
    requiredCompetence: 30,
    effects: { sports: 5 }
  },
  {
    id: 'villes',
    title: 'Ministre des Villes',
    importance: 20,
    requiredCompetence: 30,
    effects: { villes: 5 }
  },
  {
    id: 'outre-mer',
    title: 'Ministre des Outre-Mer',
    importance: 15,
    requiredCompetence: 25,
    effects: { outreMer: 5 }
  },
  // ... autres postes ministériels
];