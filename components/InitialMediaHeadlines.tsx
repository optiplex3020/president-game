import React, { useMemo } from 'react';
import { useMasterGame } from '../src/context/MasterGameContext';
import '../src/styles/InitialMediaHeadlines.css';

interface InitialMediaHeadlinesProps {
  playerInfo: {
    firstName: string;
    lastName: string;
    age: number;
    previousRole: string;
  };
  selectedParty: {
    name: string;
    id: string;
  };
}

export const InitialMediaHeadlines: React.FC<InitialMediaHeadlinesProps> = ({
  playerInfo,
  selectedParty
}) => {
  const { media } = useMasterGame();

  const headlines = useMemo(() => {
    const results: Array<{
      outlet: string;
      headline: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      bias: string;
    }> = [];

    const playerName = `${playerInfo.firstName} ${playerInfo.lastName}`;
    const age = playerInfo.age;
    const party = selectedParty.name;

    // Templates de titres selon le biais du média
    const headlineTemplates = {
      extreme_left: {
        positive: [
          `${playerName}: Une victoire du peuple !`,
          `L'espoir d'un changement social avec ${playerName}`
        ],
        neutral: [
          `${playerName} élu(e) : Qu'attendre de ${party} ?`,
          `Election présidentielle : ${playerName} à l'Élysée`
        ],
        negative: [
          `${playerName} : La continuité libérale`,
          `Déception : ${playerName} ne changera rien au système`
        ]
      },
      left: {
        positive: [
          `${playerName} : Une nouvelle ère pour la France`,
          `Élection de ${playerName} : L'espoir renaît`
        ],
        neutral: [
          `${playerName} élu(e) Président(e) de la République`,
          `Présidentielle : ${playerName} (${party}) l'emporte`
        ],
        negative: [
          `${playerName} : Des promesses à tenir`,
          `Victoire de ${playerName} : La gauche reste vigilante`
        ]
      },
      center_left: {
        positive: [
          `${playerName} : Un président pour rassembler`,
          `Election de ${playerName} : Une victoire de la raison`
        ],
        neutral: [
          `${playerName} nouveau Président : Les défis qui l'attendent`,
          `Présidentielle : ${playerName} élu(e) avec ${age} ans`
        ],
        negative: [
          `${playerName} : Saura-t-il/elle convaincre ?`,
          `Élection de ${playerName} : L'inquiétude persiste`
        ]
      },
      center: {
        positive: [
          `${playerName} élu(e) : La France a choisi`,
          `Présidentielle : ${playerName} s'impose`
        ],
        neutral: [
          `${playerName} Président(e) : Portrait d'un parcours`,
          `Election présidentielle : ${playerName} à 53% des voix`
        ],
        negative: [
          `${playerName} : Une victoire en demi-teinte`,
          `Présidentielle : ${playerName} face à une France divisée`
        ]
      },
      center_right: {
        positive: [
          `${playerName} : L'homme/La femme de la situation`,
          `Victoire de ${playerName} : La France fait le bon choix`
        ],
        neutral: [
          `${playerName} élu(e) Président(e)`,
          `Présidentielle : ${playerName} (${party}) à l'Élysée`
        ],
        negative: [
          `${playerName} : Des défis économiques considérables`,
          `Election de ${playerName} : L'opposition déjà mobilisée`
        ]
      },
      right: {
        positive: [
          `${playerName} : Un président pour redresser la France`,
          `Victoire de ${playerName} : L'autorité retrouvée`
        ],
        neutral: [
          `${playerName} élu(e) : Quel programme pour la France ?`,
          `Présidentielle : ${playerName} nouveau chef de l'État`
        ],
        negative: [
          `${playerName} : Attention aux dérives`,
          `Election de ${playerName} : La droite reste divisée`
        ]
      },
      extreme_right: {
        positive: [
          `${playerName} : Enfin un président patriote !`,
          `Victoire de ${playerName} : Le peuple a parlé`
        ],
        neutral: [
          `${playerName} élu(e) Président(e) de la République`,
          `Présidentielle : ${playerName} l'emporte`
        ],
        negative: [
          `${playerName} : Trop faible face à l'immigration`,
          `Election de ${playerName} : Déception nationale`
        ]
      }
    };

    // Générer un article pour chaque média
    Object.values(media.outlets).forEach(outlet => {
      const bias = outlet.editorialLine.bias;
      const templates = headlineTemplates[bias] || headlineTemplates.center;

      // Déterminer le sentiment selon le parti du joueur et le biais du média
      let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';

      // Logique simplifiée de sentiment
      const partyBias: Record<string, number> = {
        'renaissance': 10,
        'lr': 30,
        'rn': 70,
        'lfi': -70,
        'ps': -30,
        'eelv': -40,
        'modem': 0,
        'reconquete': 80,
        'nfp': -60,
        'lapres': -50
      };

      const mediaBiasScore: Record<string, number> = {
        'extreme_left': -80,
        'left': -40,
        'center_left': -20,
        'center': 0,
        'center_right': 20,
        'right': 40,
        'extreme_right': 80
      };

      const partyScore = partyBias[selectedParty.id] || 0;
      const mediaScore = mediaBiasScore[bias] || 0;
      const alignment = Math.abs(partyScore - mediaScore);

      if (alignment < 30) {
        sentiment = 'positive';
      } else if (alignment > 60) {
        sentiment = 'negative';
      }

      // Ajouter un peu de random
      const random = Math.random();
      if (random < 0.2) {
        sentiment = 'neutral';
      }

      const headlineList = templates[sentiment];
      const headline = headlineList[Math.floor(Math.random() * headlineList.length)];

      results.push({
        outlet: outlet.name,
        headline,
        sentiment,
        bias
      });
    });

    return results;
  }, [playerInfo, selectedParty, media.outlets]);

  return (
    <section className="initial-media-headlines">
      <h3>🗞️ Les médias réagissent à votre élection</h3>
      <p className="headlines-subtitle">
        Voici comment les 8 principaux médias français ont annoncé votre victoire
      </p>
      <div className="headlines-grid">
        {headlines.map((item, index) => (
          <div key={index} className={`headline-card sentiment-${item.sentiment}`}>
            <div className="headline-outlet">
              <span className="outlet-name">{item.outlet}</span>
              <span className={`sentiment-badge ${item.sentiment}`}>
                {item.sentiment === 'positive' && '📈'}
                {item.sentiment === 'neutral' && '📊'}
                {item.sentiment === 'negative' && '📉'}
              </span>
            </div>
            <h4 className="headline-text">{item.headline}</h4>
            <div className="headline-meta">
              <span className="bias-indicator">{item.bias.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
