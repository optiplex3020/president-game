import React, { useMemo } from 'react';
import { useParliamentEngine } from '../src/systems/ParliamentEngine';
import type { PartyId } from '../src/types/parliament';
import '../src/styles/ParliamentHemicycle.css';

const PARTY_COLORS: Record<PartyId, string> = {
  renaissance: '#FFEB00',
  rn: '#003366',
  lfi: '#CC2443',
  lr: '#0066CC',
  ps: '#FF8080',
  ecologistes: '#00C000',
  horizons: '#FF6600',
  modem: '#FF9900',
  pcf: '#DD0000',
  liot: '#00CCCC',
  udi: '#00AAFF',
  divers_gauche: '#FFB6C1',
  divers_droite: '#6CA6CD',
  independant: '#808080'
};

interface ParliamentHemicycleProps {
  highlightedDeputies?: string[]; // IDs de députés à mettre en surbrillance
  onDeputyClick?: (deputyId: string) => void;
  showVotePrediction?: boolean;
  lawId?: string; // Pour afficher la prédiction de vote
}

export const ParliamentHemicycle: React.FC<ParliamentHemicycleProps> = ({
  highlightedDeputies = [],
  onDeputyClick,
  showVotePrediction = false,
  lawId
}) => {
  const { deputies, calculateDeputyVoteProbability, getLaw } = useParliamentEngine();

  const law = lawId ? getLaw(lawId) : null;

  // Calculer les positions des députés en hémicycle
  const deputyPositions = useMemo(() => {
    const rows = 12; // Nombre de rangées
    const positions: Array<{
      id: string;
      x: number;
      y: number;
      party: PartyId;
      voteProba?: { pour: number; contre: number; abstention: number };
    }> = [];

    let deputyIndex = 0;
    const totalDeputies = deputies.length;

    for (let row = 0; row < rows; row++) {
      const deputiesInRow = Math.ceil(totalDeputies / rows * (row + 1) / rows);
      const radius = 150 + row * 40; // Rayon augmente avec les rangées
      const angleSpan = Math.PI; // Demi-cercle
      const angleStep = angleSpan / (deputiesInRow - 1 || 1);

      for (let i = 0; i < deputiesInRow && deputyIndex < totalDeputies; i++) {
        const deputy = deputies[deputyIndex];
        const angle = -Math.PI / 2 + i * angleStep; // De -90° à 90°

        const x = 400 + radius * Math.cos(angle);
        const y = 450 - radius * Math.sin(angle);

        let voteProba;
        if (showVotePrediction && law) {
          voteProba = calculateDeputyVoteProbability(deputy, law);
        }

        positions.push({
          id: deputy.id,
          x,
          y,
          party: deputy.party,
          voteProba
        });

        deputyIndex++;
      }
    }

    return positions;
  }, [deputies, showVotePrediction, law]);

  // Calculer la répartition par parti
  const partyDistribution = useMemo(() => {
    const distribution: Record<PartyId, number> = {} as any;
    deputies.forEach(d => {
      distribution[d.party] = (distribution[d.party] || 0) + 1;
    });
    return distribution;
  }, [deputies]);

  // Calculer la prédiction de vote globale
  const votePrediction = useMemo(() => {
    if (!showVotePrediction || !law) return null;

    let pour = 0;
    let contre = 0;
    let abstention = 0;

    deputyPositions.forEach(pos => {
      if (pos.voteProba) {
        const rand = Math.random() * 100;
        if (rand < pos.voteProba.pour) {
          pour++;
        } else if (rand < pos.voteProba.pour + pos.voteProba.contre) {
          contre++;
        } else {
          abstention++;
        }
      }
    });

    return { pour, contre, abstention };
  }, [deputyPositions, showVotePrediction, law]);

  const getDeputyColor = (pos: typeof deputyPositions[0]) => {
    if (showVotePrediction && pos.voteProba) {
      // Couleur selon la prédiction de vote
      if (pos.voteProba.pour > 60) return '#00CC00'; // Vert = pour
      if (pos.voteProba.contre > 60) return '#CC0000'; // Rouge = contre
      if (pos.voteProba.abstention > 60) return '#CCCCCC'; // Gris = abstention
      return '#FFAA00'; // Orange = incertain
    }
    return PARTY_COLORS[pos.party] || '#808080';
  };

  return (
    <div className="parliament-hemicycle">
      <div className="hemicycle-header">
        <h2>Assemblée Nationale - 577 Députés</h2>
        {votePrediction && (
          <div className="vote-prediction">
            <div className="prediction-bar">
              <div
                className="bar-pour"
                style={{ width: `${(votePrediction.pour / 577) * 100}%` }}
              >
                {votePrediction.pour}
              </div>
              <div
                className="bar-contre"
                style={{ width: `${(votePrediction.contre / 577) * 100}%` }}
              >
                {votePrediction.contre}
              </div>
              <div
                className="bar-abstention"
                style={{ width: `${(votePrediction.abstention / 577) * 100}%` }}
              >
                {votePrediction.abstention}
              </div>
            </div>
            <div className="prediction-result">
              {votePrediction.pour >= 289 ? (
                <span className="result-pass">✓ LOI ADOPTÉE (289 voix nécessaires)</span>
              ) : (
                <span className="result-fail">✗ LOI REJETÉE ({289 - votePrediction.pour} voix manquantes)</span>
              )}
            </div>
          </div>
        )}
      </div>

      <svg
        width="800"
        height="500"
        viewBox="0 0 800 500"
        className="hemicycle-svg"
      >
        {/* Estrade du président de l'Assemblée */}
        <rect x="350" y="430" width="100" height="50" fill="#8B4513" rx="5" />
        <text x="400" y="460" textAnchor="middle" fill="white" fontSize="12">
          Président AN
        </text>

        {/* Députés */}
        {deputyPositions.map((pos) => {
          const isHighlighted = highlightedDeputies.includes(pos.id);

          return (
            <g key={pos.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHighlighted ? 6 : 4}
                fill={getDeputyColor(pos)}
                stroke={isHighlighted ? '#FFD700' : '#333'}
                strokeWidth={isHighlighted ? 2 : 0.5}
                className="deputy-dot"
                onClick={() => onDeputyClick?.(pos.id)}
                style={{ cursor: onDeputyClick ? 'pointer' : 'default' }}
              />
              {isHighlighted && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={10}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth={2}
                  opacity={0.5}
                  className="deputy-highlight"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Légende des partis */}
      <div className="party-legend">
        {Object.entries(partyDistribution)
          .sort((a, b) => b[1] - a[1])
          .map(([party, count]) => (
            <div key={party} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: PARTY_COLORS[party as PartyId] }}
              />
              <span className="legend-label">{party.toUpperCase()}</span>
              <span className="legend-count">{count}</span>
            </div>
          ))}
      </div>

      {showVotePrediction && (
        <div className="vote-legend">
          <h3>Légende du vote</h3>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#00CC00' }} />
            <span>Pour (&gt;60%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#CC0000' }} />
            <span>Contre (&gt;60%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#CCCCCC' }} />
            <span>Abstention (&gt;60%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFAA00' }} />
            <span>Incertain</span>
          </div>
        </div>
      )}
    </div>
  );
};
