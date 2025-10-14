// @ts-nocheck
import React, { useMemo } from 'react';
import type { PoliticalParty } from '../src/types/party';
import type { PotentialMinister } from '../src/types/cabinet';
import { PRIME_MINISTER_CANDIDATES } from '../src/data/primeMinisterCandidates';
import { useMasterGame } from '../src/context/MasterGameContext';
import { PartyCompositionWidget } from './PartyCompositionWidget';
import { OpinionPreview } from './OpinionPreview';
import '../src/styles/InitialContextScreen.css';

interface InitialContextScreenProps {
  playerInfo: {
    firstName: string;
    lastName: string;
    age: number;
    previousRole: string;
  };
  selectedParty: PoliticalParty;
  primeMinister: PotentialMinister | null;
  enginesReady: boolean;
  onContinue: () => void;
}

export const InitialContextScreen: React.FC<InitialContextScreenProps> = ({
  playerInfo,
  selectedParty,
  primeMinister,
  enginesReady,
  onContinue
}) => {
  const { master, media } = useMasterGame();

  const primeMinisterProfile = useMemo(
    () => PRIME_MINISTER_CANDIDATES.find(candidate => candidate.id === primeMinister?.id),
    [primeMinister]
  );

  const globalStats = useMemo(() => {
    if (!enginesReady) return null;
    try {
      return master.getGlobalStats();
    } catch (error) {
      return null;
    }
  }, [enginesReady, master]);

  const agendaPriorities = useMemo(() => media.mediaAgenda.slice(0, 4), [media.mediaAgenda]);
  const partyId = (selectedParty.parliamentaryId ?? selectedParty.id) as any;

  return (
    <div className="initial-context-screen">
      <div className="context-grid">
        <section className="presidential-briefing">
          <header>
            <h2>Briefing présidentiel</h2>
            <p>Voici la photographie stratégique de votre début de mandat.</p>
          </header>
          <div className="briefing-content">
            <div className="president-card">
              <div className="presidential-title">
                <span className="title-label">Président/Présidente</span>
                <h3>
                  {playerInfo.firstName || 'Votre'} {playerInfo.lastName || 'Nom'}
                </h3>
              </div>
              <ul className="president-details">
                <li>
                  <span>Âge</span>
                  <strong>{playerInfo.age} ans</strong>
                </li>
                {playerInfo.previousRole && (
                  <li>
                    <span>Expérience clé</span>
                    <strong>{playerInfo.previousRole}</strong>
                  </li>
                )}
                <li>
                  <span>Parti sélectionné</span>
                  <strong>{selectedParty.name}</strong>
                </li>
              </ul>
            </div>

            {primeMinister && primeMinisterProfile && (
              <div className="prime-minister-card">
                <span className="title-label">Premier ministre pressenti</span>
                <h3>{primeMinisterProfile.firstName} {primeMinisterProfile.lastName}</h3>
                <p>{primeMinisterProfile.biography}</p>
                <div className="prime-minister-stats">
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
                <div className="prime-minister-axes">
                  {primeMinisterProfile.specialties.slice(0, 3).map(tag => (
                    <span key={tag} className="pm-chip">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="parliament-section">
          <PartyCompositionWidget selectedPartyId={partyId} />
        </section>

        <section className="opinion-section">
          <OpinionPreview />
        </section>

        <section className="media-agenda-section">
          <h3>Agenda médiatique immédiat</h3>
          <ul className="media-agenda-list">
            {agendaPriorities.map(item => (
              <li key={item.topic}>
                <div className="agenda-topic">
                  <span>{item.topic.replace('_', ' ')}</span>
                  <strong>Priorité {item.priority}</strong>
                </div>
                <div className="agenda-trend">
                  <span>Couverture actuelle : {item.coverage}%</span>
                  <span>Sentiment : {item.sentiment >= 0 ? '+' : ''}{item.sentiment}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {globalStats && (
          <section className="key-stats-section">
            <h3>Indicateurs clés projetés</h3>
            <div className="key-stats-grid">
              <div className="stat-card">
                <span>Popularité</span>
                <strong>{Math.round(globalStats.popularity)}%</strong>
              </div>
              <div className="stat-card">
                <span>Capital politique</span>
                <strong>{globalStats.politicalCapital}</strong>
              </div>
              <div className="stat-card">
                <span>Économie</span>
                <strong>{Math.round(globalStats.economicHealth)} / 100</strong>
              </div>
              <div className="stat-card">
                <span>Stabilité sociale</span>
                <strong>{Math.round(globalStats.socialStability)} / 100</strong>
              </div>
              <div className="stat-card">
                <span>Rayonnement international</span>
                <strong>{Math.round(globalStats.internationalStanding)} / 100</strong>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="context-actions">
        <button className="btn-primary" onClick={onContinue}>
          Continuer vers la confirmation
        </button>
      </div>
    </div>
  );
};

