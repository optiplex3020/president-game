/**
 * SYSTÈME DE SIMULATION ÉCONOMIQUE AVANCÉ
 * 
 * Modélise l'économie française avec :
 * - Cycles économiques réalistes
 * - Interdépendances sectorielles
 * - Impact des politiques publiques
 * - Indicateurs macro et microéconomiques
 * - Réactions des marchés et acteurs économiques
 */

import { create } from 'zustand';

export interface EconomicState {
  // Indicateurs macroéconomiques principaux
  macro: {
    gdp: {
      total: number; // PIB nominal en milliards €
      growth: number; // Croissance trimestrielle annualisée
      perCapita: number; // PIB par habitant
      trend: number[]; // Historique sur 12 trimestres
    };

    employment: {
      activePopulation: number; // 29.7M personnes actives
      unemployed: number; // Millions de chômeurs
      rate: number; // Taux de chômage
      underemployment: number; // Temps partiel subi
      jobCreation: number; // Créations nettes mensuelles
      byCategory: {
        youth: number; // 16-25 ans
        longTerm: number; // > 12 mois
        senior: number; // > 50 ans
        skilled: number; // Cadres/techniciens
      };
    };

    prices: {
      cpi: number; // Indice des prix à la consommation
      inflation: number; // Inflation annuelle
      core: number; // Inflation sous-jacente
      energy: number; // Prix de l'énergie
      food: number; // Prix alimentaires
      housing: number; // Coût logement
      expectations: number; // Anticipations d'inflation
    };

    trade: {
      exports: number; // Milliards € annuels
      imports: number; // Milliards € annuels
      balance: number; // Balance commerciale
      competitiveness: number; // Indice 0-100
      exchangeRate: number; // EUR/USD
    };
  };

  // Secteurs économiques détaillés
  sectors: {
    agriculture: EconomicSector;
    industry: EconomicSector;
    construction: EconomicSector;
    services: EconomicSector;
    finance: EconomicSector;
    energy: EconomicSector;
    technology: EconomicSector;
    tourism: EconomicSector;
    transport: EconomicSector;
    retail: EconomicSector;
  };

  // Finances publiques
  publicFinances: {
    budget: {
      income: BudgetIncome;
      expenses: BudgetExpenses;
      balance: number; // Déficit/excédent
      structural: number; // Balance structurelle
    };

    debt: {
      total: number; // Dette totale en Mds €
      gdpRatio: number; // % du PIB
      interestRate: number; // Taux moyen
      interestPayments: number; // Charge de la dette
      maturityProfile: number[]; // Échéances par année
    };

    taxation: {
      totalRevenue: number;
      taxPressure: number; // % du PIB
      byType: Record<TaxType, number>;
      efficiency: number; // Rendement fiscal
      evasion: number; // Fraude estimée
    };
  };

  // Acteurs économiques et marchés
  actors: {
    households: {
      disposableIncome: number; // Revenu disponible moyen
      savingsRate: number; // Taux d'épargne
      consumption: number; // Consommation totale
      confidence: number; // Confiance des ménages 0-100
      debt: number; // Endettement des ménages
      inequality: number; // Coefficient de Gini
    };

    businesses: {
      investment: number; // FBCF des entreprises
      profitability: number; // Taux de marge
      confidence: number; // Climat des affaires
      startups: number; // Créations d'entreprises/mois
      bankruptcies: number; // Défaillances/mois
      creditAccess: number; // Facilité d'accès au crédit
    };

    banks: {
      creditVolume: number; // Encours de crédit
      interestRates: {
        mortgage: number;
        consumer: number;
        business: number;
      };
      solvency: number; // Ratio de solvabilité
      profitability: number;
    };

    markets: {
      stockIndex: number; // CAC40 simulé
      volatility: number; // VIX français
      bondYield: number; // OAT 10 ans
      realEstate: number; // Prix immobilier moyen
      commodities: Record<string, number>;
    };
  };

  // Cycles et tendances
  cycles: {
    economic: {
      phase: 'recession' | 'recovery' | 'expansion' | 'peak';
      duration: number; // Mois dans la phase actuelle
      amplitude: number; // Intensité du cycle
    };

    business: {
      confidence: number; // Climat des affaires
      orders: number; // Carnets de commandes
      capacity: number; // Taux d'utilisation
    };

    external: {
      eurozone: number; // Croissance zone euro
      worldTrade: number; // Commerce mondial
      oilPrice: number; // Prix du baril Brent
      commodity: number; // Indice matières premières
    };
  };
}

export interface EconomicSector {
  name: string;
  weight: number; // % du PIB
  employment: number; // Millions d'emplois
  productivity: number; // Production par employé
  growth: number; // Croissance sectorielle
  investment: number; // Investissement annuel
  exports: number; // Part des exportations
  
  // Santé sectorielle
  health: {
    profitability: number;
    competitiveness: number;
    innovation: number;
    sustainability: number;
  };

  // Défis spécifiques
  challenges: string[];
  opportunities: string[];
  
  // Sensibilités
  sensitivity: {
    policy: number; // Sensibilité aux politiques
    external: number; // Sensibilité externe
    cycle: number; // Sensibilité cyclique
  };
}

export interface BudgetIncome {
  vat: number; // TVA
  income: number; // Impôt sur le revenu
  corporate: number; // Impôt sur les sociétés
  social: number; // Cotisations sociales
  energy: number; // TICPE et autres
  local: number; // Transferts locaux
  other: number; // Autres recettes
  total: number;
}

export interface BudgetExpenses {
  social: number; // Protection sociale
  education: number; // Éducation nationale
  defense: number; // Défense
  security: number; // Sécurité intérieure
  justice: number; // Justice
  research: number; // Recherche
  infrastructure: number; // Équipement
  interest: number; // Charge de la dette
  transfers: number; // Transferts locaux
  other: number; // Autres dépenses
  total: number;
}

export type TaxType = 
  | 'income' | 'corporate' | 'vat' | 'social' | 'property' 
  | 'energy' | 'environmental' | 'wealth' | 'inheritance';

// Modèles de simulation économique
export interface EconomicModel {
  // Fonctions de production
  calculateGDPGrowth: (factors: GrowthFactors) => number;
  
  // Modèles sectoriels  
  simulateSectorPerformance: (sector: keyof EconomicState['sectors'], shocks: PolicyShock[]) => EconomicSector;
  
  // Modèles de marché
  calculateInflation: (demandPressure: number, supplyCost: number, expectations: number) => number;
  calculateUnemployment: (gdpGrowth: number, productivity: number, laborPolicy: number) => number;
  
  // Réactions des agents
  simulateHouseholdBehavior: (income: number, confidence: number, inflation: number) => HouseholdResponse;
  simulateBusinessInvestment: (profitability: number, demand: number, policy: number) => BusinessResponse;
  
  // Interactions sectorielles
  calculateSectoralImpacts: (primarySector: string, shock: number) => Record<string, number>;
  
  // Modèles financiers
  calculateBondRates: (debt: number, inflation: number, risk: number) => number;
  simulateStockMarket: (earnings: number, confidence: number, external: number) => number;
}

export interface GrowthFactors {
  consumption: number;
  investment: number;
  government: number;
  exports: number;
  imports: number;
  productivity: number;
  demographics: number;
}

export interface PolicyShock {
  type: 'fiscal' | 'monetary' | 'regulatory' | 'structural';
  domain: string;
  intensity: number; // -100 à +100
  duration: number; // mois
  transmission: number; // vitesse de transmission 0-100
}

export interface HouseholdResponse {
  consumptionChange: number;
  savingsRateChange: number;
  confidenceChange: number;
  laborSupplyChange: number;
}

export interface BusinessResponse {
  investmentChange: number;
  hiringChange: number;
  pricingChange: number;
  confidenceChange: number;
}

// Store de simulation économique
export const useEconomicSimulation = create<EconomicState & EconomicModel>((set, get) => ({
  // État économique initial (données réalistes France 2024)
  macro: {
    gdp: {
      total: 2800, // PIB nominal 2800 Mds €
      growth: 1.2,
      perCapita: 41500,
      trend: [0.8, 1.1, 1.5, 0.9, 1.2, 1.8, 0.6, 1.4, 1.1, 0.8, 1.3, 1.2]
    },

    employment: {
      activePopulation: 29.7,
      unemployed: 2.2,
      rate: 7.4,
      underemployment: 5.8,
      jobCreation: 15000,
      byCategory: {
        youth: 16.8,
        longTerm: 2.7,
        senior: 6.2,
        skilled: 4.1
      }
    },

    prices: {
      cpi: 107.8,
      inflation: 2.1,
      core: 1.8,
      energy: 12.3,
      food: 3.4,
      housing: 2.8,
      expectations: 2.3
    },

    trade: {
      exports: 780,
      imports: 820,
      balance: -40,
      competitiveness: 72,
      exchangeRate: 1.08
    }
  },

  sectors: {
    agriculture: {
      name: 'Agriculture',
      weight: 1.8,
      employment: 0.85,
      productivity: 68000,
      growth: 2.1,
      investment: 8.2,
      exports: 15.2,
      health: {
        profitability: 68,
        competitiveness: 72,
        innovation: 45,
        sustainability: 38
      },
      challenges: ['Changement climatique', 'Réglementation environnementale', 'Concurrence internationale'],
      opportunities: ['Agriculture biologique', 'Circuits courts', 'Technologies vertes'],
      sensitivity: { policy: 85, external: 75, cycle: 35 }
    },

    industry: {
      name: 'Industrie',
      weight: 13.4,
      employment: 3.1,
      productivity: 95000,
      growth: 0.8,
      investment: 42.1,
      exports: 35.8,
      health: {
        profitability: 72,
        competitiveness: 68,
        innovation: 78,
        sustainability: 52
      },
      challenges: ['Désindustrialisation', 'Coûts énergétiques', 'Compétition asiatique'],
      opportunities: ['Industrie 4.0', 'Relocalisations', 'Technologies vertes'],
      sensitivity: { policy: 65, external: 90, cycle: 85 }
    },

    construction: {
      name: 'Construction',
      weight: 5.2,
      employment: 1.4,
      productivity: 52000,
      growth: -1.2,
      investment: 18.5,
      exports: 2.1,
      health: {
        profitability: 58,
        competitiveness: 65,
        innovation: 42,
        sustainability: 48
      },
      challenges: ['Hausse des matériaux', 'Réglementation environnementale', 'Pénurie main-d\'œuvre'],
      opportunities: ['Rénovation énergétique', 'Construction durable', 'Logement social'],
      sensitivity: { policy: 95, external: 45, cycle: 95 }
    },

    services: {
      name: 'Services',
      weight: 79.6,
      employment: 24.3,
      productivity: 75000,
      growth: 1.8,
      investment: 125.4,
      exports: 47.1,
      health: {
        profitability: 75,
        competitiveness: 78,
        innovation: 82,
        sustainability: 65
      },
      challenges: ['Numérisation', 'Concurrence internationale', 'Qualification'],
      opportunities: ['Services numériques', 'Silver économie', 'Services environnementaux'],
      sensitivity: { policy: 55, external: 65, cycle: 70 }
    },

    // ... autres secteurs avec données détaillées
    finance: {
      name: 'Finance',
      weight: 4.8,
      employment: 0.85,
      productivity: 128000,
      growth: 2.3,
      investment: 15.2,
      exports: 8.9,
      health: {
        profitability: 82,
        competitiveness: 85,
        innovation: 88,
        sustainability: 58
      },
      challenges: ['Réglementation prudentielle', 'Taux bas', 'Fintech'],
      opportunities: ['Finance verte', 'Technologies blockchain', 'Assurance paramétrique'],
      sensitivity: { policy: 90, external: 85, cycle: 75 }
    },

    energy: {
      name: 'Énergie',
      weight: 2.1,
      employment: 0.15,
      productivity: 185000,
      growth: 1.5,
      investment: 28.7,
      exports: 12.3,
      health: {
        profitability: 68,
        competitiveness: 72,
        innovation: 78,
        sustainability: 72
      },
      challenges: ['Transition énergétique', 'Mix électrique', 'Intermittence renouvelables'],
      opportunities: ['Énergies renouvelables', 'Stockage', 'Hydrogène vert'],
      sensitivity: { policy: 95, external: 78, cycle: 45 }
    },

    technology: {
      name: 'Technologies',
      weight: 8.9,
      employment: 1.2,
      productivity: 145000,
      growth: 5.2,
      investment: 45.8,
      exports: 25.7,
      health: {
        profitability: 85,
        competitiveness: 75,
        innovation: 95,
        sustainability: 68
      },
      challenges: ['Compétition GAFAM', 'Pénurie talents', 'Souveraineté numérique'],
      opportunities: ['IA', 'Cybersécurité', 'GreenTech', 'HealthTech'],
      sensitivity: { policy: 75, external: 85, cycle: 65 }
    },

    tourism: {
      name: 'Tourisme',
      weight: 7.4,
      employment: 2.1,
      productivity: 42000,
      growth: 3.8,
      investment: 12.4,
      exports: 68.2,
      health: {
        profitability: 65,
        competitiveness: 88,
        innovation: 52,
        sustainability: 42
      },
      challenges: ['Saisonnalité', 'Concurrence internationale', 'Impact environnemental'],
      opportunities: ['Tourisme durable', 'Oenotourisme', 'Tourisme d\'affaires'],
      sensitivity: { policy: 45, external: 95, cycle: 90 }
    },

    transport: {
      name: 'Transport',
      weight: 4.7,
      employment: 1.8,
      productivity: 58000,
      growth: 1.1,
      investment: 22.3,
      exports: 18.5,
      health: {
        profitability: 62,
        competitiveness: 68,
        innovation: 72,
        sustainability: 35
      },
      challenges: ['Transition écologique', 'Infrastructure vieillissante', 'Réglementation sociale'],
      opportunities: ['Mobilité électrique', 'Transport autonome', 'Logistique verte'],
      sensitivity: { policy: 85, external: 75, cycle: 80 }
    },

    retail: {
      name: 'Commerce',
      weight: 11.2,
      employment: 3.2,
      productivity: 48000,
      growth: 0.9,
      investment: 18.9,
      exports: 5.2,
      health: {
        profitability: 58,
        competitiveness: 65,
        innovation: 68,
        sustainability: 48
      },
      challenges: ['E-commerce', 'Centres-villes', 'Marges serrées'],
      opportunities: ['Omnicanal', 'Commerce de proximité', 'Consommation responsable'],
      sensitivity: { policy: 65, external: 55, cycle: 95 }
    }
  },

  publicFinances: {
    budget: {
      income: {
        vat: 198,
        income: 88,
        corporate: 67,
        social: 445,
        energy: 42,
        local: 89,
        other: 156,
        total: 1085
      },
      expenses: {
        social: 485,
        education: 165,
        defense: 58,
        security: 28,
        justice: 12,
        research: 28,
        infrastructure: 45,
        interest: 52,
        transfers: 125,
        other: 142,
        total: 1140
      },
      balance: -55,
      structural: -2.8
    },

    debt: {
      total: 3100,
      gdpRatio: 110.8,
      interestRate: 2.8,
      interestPayments: 52,
      maturityProfile: [180, 220, 240, 195, 165, 145, 125, 105, 95, 85]
    },

    taxation: {
      totalRevenue: 1085,
      taxPressure: 38.7,
      byType: {
        income: 88,
        corporate: 67,
        vat: 198,
        social: 445,
        property: 65,
        energy: 42,
        environmental: 12,
        wealth: 8,
        inheritance: 15
      },
      efficiency: 78,
      evasion: 45
    }
  },

  actors: {
    households: {
      disposableIncome: 28500,
      savingsRate: 14.8,
      consumption: 1580,
      confidence: 62,
      debt: 1450,
      inequality: 0.289
    },

    businesses: {
      investment: 385,
      profitability: 28.5,
      confidence: 68,
      startups: 58000,
      bankruptcies: 2800,
      creditAccess: 72
    },

    banks: {
      creditVolume: 4850,
      interestRates: {
        mortgage: 3.85,
        consumer: 6.2,
        business: 4.1
      },
      solvency: 15.2,
      profitability: 8.4
    },

    markets: {
      stockIndex: 7850,
      volatility: 18.5,
      bondYield: 2.95,
      realEstate: 285000,
      commodities: {
        oil: 85,
        gas: 28,
        wheat: 245,
        copper: 8500
      }
    }
  },

  cycles: {
    economic: {
      phase: 'recovery',
      duration: 18,
      amplitude: 65
    },

    business: {
      confidence: 68,
      orders: 72,
      capacity: 78.5
    },

    external: {
      eurozone: 0.8,
      worldTrade: 2.1,
      oilPrice: 85,
      commodity: 128
    }
  },

  // Méthodes de simulation
  calculateGDPGrowth: (factors: GrowthFactors) => {
    // Modèle de croissance avec composantes de demande
    return (factors.consumption * 0.55 + factors.investment * 0.23 + 
            factors.government * 0.24 + (factors.exports - factors.imports) * 0.05) *
           (1 + factors.productivity * 0.3) * (1 + factors.demographics * 0.1);
  },

  simulateSectorPerformance: (sector, shocks) => {
    const currentSector = get().sectors[sector];
    let impactedSector = { ...currentSector };

    // Applique les chocs de politique
    shocks.forEach(shock => {
      const sensitivity = currentSector.sensitivity;
      let impact = 0;

      switch (shock.type) {
        case 'fiscal':
          impact = shock.intensity * sensitivity.policy * 0.01;
          break;
        case 'regulatory':
          impact = shock.intensity * sensitivity.policy * 0.015;
          break;
        // ... autres types de chocs
      }

      impactedSector.growth += impact;
      impactedSector.health.profitability += impact * 0.5;
    });

    return impactedSector;
  },

  calculateInflation: (demandPressure, supplyCost, expectations) => {
    // Modèle d'inflation avec courbe de Phillips modifiée
    const baseInflation = 2.0;
    const demandEffect = demandPressure * 0.3;
    const supplyEffect = supplyCost * 0.4;
    const expectationsEffect = expectations * 0.3;
    
    return baseInflation + demandEffect + supplyEffect + expectationsEffect;
  },

  calculateUnemployment: (gdpGrowth, productivity, laborPolicy) => {
    // Loi d'Okun adaptée à la France
    const naturalRate = 7.5;
    const okun = -0.4; // Coefficient d'Okun français
    const productivityEffect = productivity * 0.2;
    const policyEffect = laborPolicy * 0.1;

    return Math.max(3, naturalRate + okun * (gdpGrowth - 1.5) + 
                    productivityEffect + policyEffect);
  },

  simulateHouseholdBehavior: (income, confidence, inflation) => {
    const consumptionPropensity = 0.85;
    const confidenceEffect = (confidence - 50) * 0.002;
    const inflationEffect = -inflation * 0.05;

    return {
      consumptionChange: consumptionPropensity * income * (1 + confidenceEffect + inflationEffect),
      savingsRateChange: -confidenceEffect * 2,
      confidenceChange: Math.random() * 10 - 5, // Volatilité aléatoire
      laborSupplyChange: income * 0.001
    };
  },

  simulateBusinessInvestment: (profitability, demand, policy) => {
    const baseInvestment = profitability * 0.6;
    const demandAccelerator = demand * 0.8;
    const policyIncentive = policy * 0.3;

    return {
      investmentChange: baseInvestment + demandAccelerator + policyIncentive,
      hiringChange: demand * 0.4 + policy * 0.2,
      pricingChange: (demand - 50) * 0.02,
      confidenceChange: (profitability + policy - 50) * 0.1
    };
  },

  calculateSectoralImpacts: (primarySector, shock) => {
    // Matrice input-output simplifiée pour calculer les effets de contagion
    const impactMatrix: Record<string, Record<string, number>> = {
      industry: {
        construction: 0.15,
        transport: 0.12,
        energy: 0.08,
        services: 0.05
      },
      energy: {
        industry: 0.25,
        transport: 0.18,
        construction: 0.12,
        agriculture: 0.08
      },
      // ... autres relations sectorielles
    };

    const impacts: Record<string, number> = {};
    const matrix = impactMatrix[primarySector] || {};

    Object.entries(matrix).forEach(([sector, coefficient]) => {
      impacts[sector] = shock * coefficient;
    });

    return impacts;
  },

  calculateBondRates: (debt, inflation, risk) => {
    const baseRate = 1.5; // Taux sans risque
    const debtPremium = Math.max(0, (debt - 90) * 0.02); // Prime de risque dette
    const inflationPremium = Math.max(0, inflation - 2) * 0.8;
    const riskPremium = risk * 0.01;

    return baseRate + debtPremium + inflationPremium + riskPremium;
  },

  simulateStockMarket: (earnings, confidence, external) => {
    const currentIndex = get().actors.markets.stockIndex;
    const fundamentalValue = earnings * 15; // P/E de 15
    const sentimentEffect = (confidence - 50) * 0.02;
    const externalEffect = external * 0.01;
    const randomVolatility = (Math.random() - 0.5) * 0.1;

    const targetIndex = fundamentalValue * (1 + sentimentEffect + externalEffect);
    const change = (targetIndex - currentIndex) * 0.1 + randomVolatility;

    return Math.max(3000, currentIndex + change);
  }
}));