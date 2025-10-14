// @ts-nocheck
import React, { useMemo } from 'react';
import type { PoliticalParty } from '../src/types/party';
import type { PotentialMinister } from '../src/types/cabinet';
import { PRIME_MINISTER_CANDIDATES } from '../src/data/primeMinisterCandidates';
import { useMasterGame } from '../src/context/MasterGameContext';
import '../src/styles/ConfirmationScreen.css';

interface ConfirmationScreenProps {
  playerInfo: {
    firstName: string;
    lastName: string;
    age: number;
    previousRole: string;
  };
  selectedParty: PoliticalParty;
  primeMinister: PotentialMinister | null;
  cabinetMinisters: Record<string, PotentialMinister>;
  onConfirm: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  playerInfo,
  selectedParty,
  primeMinister,
  cabinetMinisters,
  onConfirm
}) => {
  const { parliament } = useMasterGame();

  const primeMinisterProfile = useMemo(
    () => PRIME_MINISTER_CANDIDATES.find(candidate => candidate.id === primeMinister?.id),
    [primeMinister]
  );

  const cabinetEntries = Object.entries(cabinetMinisters);

  const cabinetByParty = useMemo(() => {
    return cabinetEntries.reduce((acc, [role, minister]) => {
      const party = minister.party;
      if (!acc[party]) {
        acc[party] = { count: 0, roles: [] as string[] };
      }
      acc[party].count += 1;
      acc[party].roles.push(role);
      return acc;
    }, {} as Record<string, { count: number; roles: string[] }>);
  }, [cabinetEntries]);

  const majorityAssessment = useMemo(() => {
    const partyId = selectedParty.parliamentaryId ?? selectedParty.id;
    const group = parliament.parliamentaryGroups[partyId as any];
    const seats = group?.seats ?? selectedParty.seatsInParliament;
    const absoluteGap = Math.max(0, 289 - seats);
    return {
      seats,
      absoluteGap,
      relativeMajority: seats < 289 && seats > 250,
      minority: seats <= 250
    };
  }, [selectedParty, parliament.parliamentaryGroups]);

  const warnings: string[] = [];
  if (majorityAssessment.absoluteGap > 0) {
    warnings.push(
      `Majorité relative : il manque ${majorityAssessment.absoluteGap} voix pour la majorité absolue. Préparez une stratégie de coalition.`
    );
  }
  if (primeMinister && primeMinister.party.toLowerCase() !== (selectedParty.parliamentaryId ?? selectedParty.id)) {
    warnings.push('Possible cohabitation : votre Premier ministre vient d’un autre camp politique.');
  }
  if (cabinetEntries.length < 12) {
    warnings.push('Gouvernement incomplet : 12 portefeuilles minimum recommandés.');
  }

  return (
    <div className="confirmation-screen">
      <div className="confirmation-header">
        <h2>Validation finale</h2>
        <p>Revoyez vos choix avant de prendre les rênes du pays. Ce résumé sera votre feuille de route des 30 prochains jours.</p>
      </div>

      <div className="confirmation-grid">
        <section className="summary-card">
          <h3>Identité présidentielle</h3>
          <ul>
            <li>
              <span>Président(e)</span>
              <strong>{playerInfo.firstName} {playerInfo.lastName}</strong>
            </li>
            <li>
              <span>Âge</span>
              <strong>{playerInfo.age} ans</strong>
            </li>
            {playerInfo.previousRole && (
              <li>
                <span>Expérience clef</span>
                <strong>{playerInfo.previousRole}</strong>
              </li>
            )}
            <li>
              <span>Parti</span>
              <strong>{selectedParty.name}</strong>
            </li>
            <li>
              <span>Sièges</span>
              <strong>{majorityAssessment.seats} / 577</strong>
            </li>
          </ul>
        </section>

        {primeMinister && primeMinisterProfile && (
          <section className="summary-card">
            <h3>Premier ministre</h3>
            <div className="pm-summary">
              <h4>{primeMinisterProfile.firstName} {primeMinisterProfile.lastName}</h4>
              <p>{primeMinisterProfile.biography}</p>
              <div className="pm-stats">
                <div>
                  <span>Compétence</span>
                  <strong>{primeMinister.competence}</strong>
                </div>
                <div>
                  <span>Loyauté</span>
                  <strong>{primeMinister.personality?.loyalty ?? 0}</strong>
                </div>
                <div>
                  <span>Popularité</span>
                  <strong>{Math.round(primeMinisterProfile.publicProfile)}</strong>
                </div>
                <div>
                  <span>Expérience</span>
                  <strong>{primeMinister.experience} ans</strong>
                </div>
              </div>
              <div className="pm-assets">
                {primeMinisterProfile.assets.slice(0, 3).map(asset => (
                  <span key={asset} className="asset-pill">{asset}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="summary-card">
          <h3>Répartition des portefeuilles ({cabinetEntries.length})</h3>
          <div className="cabinet-breakdown">
            {Object.entries(cabinetByParty)
              .sort(([, a], [, b]) => b.count - a.count)
              .map(([party, data]) => (
                <div key={party} className="cabinet-party">
                  <div className="cabinet-party-header">
                    <span>{party}</span>
                    <strong>{data.count}</strong>
                  </div>
                  <div className="cabinet-roles">
                    {data.roles.slice(0, 6).map(role => (
                      <span key={role}>{role.replace(/_/g, ' ')}</span>
                    ))}
                    {data.roles.length > 6 && (
                      <span className="more-roles">+{data.roles.length - 6} autres</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {warnings.length > 0 && (
          <section className="summary-card warnings-card">
            <h3>Avertissements stratégiques</h3>
            <ul>
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="confirmation-actions">
        <button className="btn-primary" onClick={onConfirm}>
          Commencer le mandat
        </button>
      </div>
    </div>
  );
};

