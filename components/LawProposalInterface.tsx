import React, { useState, useMemo } from 'react';
import { useMasterGame } from '../src/context/MasterGameContext';
import { ParliamentHemicycle } from './ParliamentHemicycle';
import type { Law } from '../src/types/parliament';
import '../src/styles/LawProposalInterface.css';

export const LawProposalInterface: React.FC = () => {
  const { parliament, master } = useMasterGame();

  const [lawData, setLawData] = useState({
    title: '',
    description: '',
    category: 'economie' as Law['category'],
    ideology: {
      economicLeft: 0,
      social: 0,
      european: 0,
      environmental: 0,
      authoritarian: 0
    }
  });

  const [showResults, setShowResults] = useState(false);
  const [voteResults, setVoteResults] = useState<any>(null);
  const [votePrediction, setVotePrediction] = useState<any>(null);
  const [previewLaw, setPreviewLaw] = useState<Law | null>(null);

  // Prédiction du vote en temps réel
  React.useEffect(() => {
    if (!parliament || !lawData.title) {
      setVotePrediction(null);
      setPreviewLaw(null);
      return;
    }

    const law: Law = {
      id: `law_preview_${Date.now()}`,
      title: lawData.title,
      description: lawData.description,
      category: lawData.category,
      ideology: lawData.ideology,
      requiredMajority: 'simple',
      urgency: 'normale',
      articles: [],
      amendments: [],
      proposedBy: 'gouvernement',
      effects: {},
      stage: 'depot'
    };

    setPreviewLaw(law);

    // Add law to parliament and simulate vote
    parliament.proposeLaw(law);
    parliament.simulateVote(law.id).then(prediction => {
      setVotePrediction(prediction);
    });
  }, [parliament, lawData.title, lawData.description, lawData.category, JSON.stringify(lawData.ideology)]);

  // Calcul des députés par prédiction
  const deputiesByVote = useMemo(() => {
    if (!votePrediction || !previewLaw) return { pour: [], contre: [], abstention: [] };

    const result = {
      pour: [] as any[],
      contre: [] as any[],
      abstention: [] as any[]
    };

    parliament.deputies.forEach(deputy => {
      const prob = parliament.calculateDeputyVoteProbability(deputy, previewLaw);
      if (!prob) return;

      if (prob.pour > prob.contre && prob.pour > prob.abstention) {
        result.pour.push(deputy);
      } else if (prob.contre > prob.pour && prob.contre > prob.abstention) {
        result.contre.push(deputy);
      } else {
        result.abstention.push(deputy);
      }
    });

    return result;
  }, [votePrediction, previewLaw, parliament]);

  const handleSubmitLaw = async () => {
    if (!lawData.title.trim()) {
      alert('⚠️ Veuillez donner un titre à votre loi');
      return;
    }

    const law: Law = {
      id: `law_${Date.now()}`,
      title: lawData.title,
      description: lawData.description,
      category: lawData.category,
      ideology: lawData.ideology,
      requiredMajority: 'simple',
      urgency: 'normale',
      articles: [],
      amendments: [],
      proposedBy: 'gouvernement',
      effects: {},
      stage: 'hemicycle'
    };

    // Soumettre au vote
    parliament.proposeLaw(law);
    const results = await parliament.simulateVote(law.id);
    setVoteResults(results);
    setShowResults(true);

    // Avancer le temps
    master.advanceTime(2);
  };

  const getMajorityStatus = () => {
    if (!votePrediction) return { status: 'unknown', color: 'gray' };

    const pour = votePrediction.pour;
    const total = votePrediction.pour + votePrediction.contre + votePrediction.abstention;
    const majorityNeeded = Math.floor(total / 2) + 1;

    if (pour >= majorityNeeded) {
      return { status: 'Majorité acquise', color: 'green' };
    } else if (pour >= majorityNeeded - 20) {
      return { status: 'Majorité incertaine', color: 'orange' };
    } else {
      return { status: 'Rejet probable', color: 'red' };
    }
  };

  const majorityStatus = getMajorityStatus();

  if (showResults && voteResults) {
    return (
      <div className="law-proposal-interface">
        <div className="results-screen">
          <div className="results-header">
            <h2>📊 Résultats du vote</h2>
            <h3 className="law-title">{lawData.title}</h3>
          </div>

          <div className="results-summary">
            <div className={`result-status ${voteResults.passed ? 'adopted' : 'rejected'}`}>
              {voteResults.passed ? '✅ LOI ADOPTÉE' : '❌ LOI REJETÉE'}
            </div>

            <div className="vote-breakdown">
              <div className="vote-stat pour">
                <span className="vote-count">{voteResults.pour}</span>
                <span className="vote-label">Pour</span>
              </div>
              <div className="vote-stat contre">
                <span className="vote-count">{voteResults.contre}</span>
                <span className="vote-label">Contre</span>
              </div>
              <div className="vote-stat abstention">
                <span className="vote-count">{voteResults.abstention}</span>
                <span className="vote-label">Abstention</span>
              </div>
            </div>

            <div className="vote-details">
              <p>Total des votants : {voteResults.pour + voteResults.contre + voteResults.abstention} / 577</p>
              <p>Majorité requise : {Math.floor(577 / 2) + 1} voix</p>
              <p>Écart : {voteResults.passed ? `+${voteResults.pour - Math.floor(577 / 2) - 1}` : `-${Math.floor(577 / 2) + 1 - voteResults.pour}`} voix</p>
            </div>
          </div>

          <div className="hemicycle-results">
            <h4>Répartition dans l'hémicycle</h4>
            <ParliamentHemicycle
              highlightedDeputies={[]}
              showVotePrediction={false}
            />
          </div>

          <div className="results-actions">
            <button
              className="btn-primary"
              onClick={() => {
                setShowResults(false);
                setLawData({
                  title: '',
                  description: '',
                  category: 'economie',
                  ideology: {
                    economicLeft: 0,
                    social: 0,
                    european: 0,
                    environmental: 0,
                    authoritarian: 0
                  }
                });
              }}
            >
              Proposer une nouvelle loi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="law-proposal-interface">
      <div className="proposal-header">
        <h2>⚖️ Proposer une loi à l'Assemblée</h2>
        <p>Rédigez votre projet de loi et visualisez la prédiction de vote en temps réel</p>
      </div>

      <div className="proposal-layout">
        {/* Formulaire de proposition */}
        <div className="proposal-form">
          <div className="form-section">
            <h3>📝 Informations générales</h3>

            <div className="form-group">
              <label>Titre de la loi *</label>
              <input
                type="text"
                placeholder="Ex: Loi sur la réforme des retraites"
                value={lawData.title}
                onChange={(e) => setLawData({ ...lawData, title: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Décrivez brièvement l'objectif de cette loi..."
                value={lawData.description}
                onChange={(e) => setLawData({ ...lawData, description: e.target.value })}
                className="form-textarea"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Catégorie de loi</label>
              <select
                value={lawData.category}
                onChange={(e) => setLawData({ ...lawData, category: e.target.value as Law['category'] })}
                className="form-select"
              >
                <option value="economie">Économie</option>
                <option value="social">Social</option>
                <option value="securite">Sécurité</option>
                <option value="environnement">Environnement</option>
                <option value="justice">Justice</option>
                <option value="education">Éducation</option>
                <option value="sante">Santé</option>
                <option value="defense">Défense</option>
                <option value="affaires_etrangeres">Affaires étrangères</option>
                <option value="institutions">Institutions</option>
                <option value="culture">Culture</option>
                <option value="agriculture">Agriculture</option>
                <option value="logement">Logement</option>
                <option value="transport">Transport</option>
                <option value="numerique">Numérique</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>🎯 Positionnement idéologique</h3>
            <p className="section-hint">Ajustez les curseurs pour définir l'orientation politique de votre loi</p>

            <div className="ideology-sliders">
              <div className="slider-group">
                <label>
                  <span>Économie</span>
                  <span className="slider-value">{lawData.ideology.economicLeft > 0 ? 'Gauche' : lawData.ideology.economicLeft < 0 ? 'Droite' : 'Centre'} ({lawData.ideology.economicLeft})</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={lawData.ideology.economicLeft}
                  onChange={(e) => setLawData({
                    ...lawData,
                    ideology: { ...lawData.ideology, economicLeft: parseInt(e.target.value) }
                  })}
                  className="ideology-slider economic"
                />
                <div className="slider-labels">
                  <span>Libéral</span>
                  <span>Interventionniste</span>
                </div>
              </div>

              <div className="slider-group">
                <label>
                  <span>Social</span>
                  <span className="slider-value">{lawData.ideology.social > 0 ? 'Progressiste' : lawData.ideology.social < 0 ? 'Conservateur' : 'Modéré'} ({lawData.ideology.social})</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={lawData.ideology.social}
                  onChange={(e) => setLawData({
                    ...lawData,
                    ideology: { ...lawData.ideology, social: parseInt(e.target.value) }
                  })}
                  className="ideology-slider social"
                />
                <div className="slider-labels">
                  <span>Conservateur</span>
                  <span>Progressiste</span>
                </div>
              </div>

              <div className="slider-group">
                <label>
                  <span>Europe</span>
                  <span className="slider-value">{lawData.ideology.european > 0 ? 'Pro-UE' : lawData.ideology.european < 0 ? 'Souverainiste' : 'Neutre'} ({lawData.ideology.european})</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={lawData.ideology.european}
                  onChange={(e) => setLawData({
                    ...lawData,
                    ideology: { ...lawData.ideology, european: parseInt(e.target.value) }
                  })}
                  className="ideology-slider european"
                />
                <div className="slider-labels">
                  <span>Souverainiste</span>
                  <span>Fédéraliste</span>
                </div>
              </div>

              <div className="slider-group">
                <label>
                  <span>Environnement</span>
                  <span className="slider-value">{lawData.ideology.environmental > 0 ? 'Écologiste' : lawData.ideology.environmental < 0 ? 'Productiviste' : 'Équilibré'} ({lawData.ideology.environmental})</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={lawData.ideology.environmental}
                  onChange={(e) => setLawData({
                    ...lawData,
                    ideology: { ...lawData.ideology, environmental: parseInt(e.target.value) }
                  })}
                  className="ideology-slider environmental"
                />
                <div className="slider-labels">
                  <span>Croissance</span>
                  <span>Transition</span>
                </div>
              </div>

              <div className="slider-group">
                <label>
                  <span>Autorité</span>
                  <span className="slider-value">{lawData.ideology.authoritarian > 0 ? 'Sécuritaire' : lawData.ideology.authoritarian < 0 ? 'Libertaire' : 'Équilibré'} ({lawData.ideology.authoritarian})</span>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={lawData.ideology.authoritarian}
                  onChange={(e) => setLawData({
                    ...lawData,
                    ideology: { ...lawData.ideology, authoritarian: parseInt(e.target.value) }
                  })}
                  className="ideology-slider authoritarian"
                />
                <div className="slider-labels">
                  <span>Libertés</span>
                  <span>Sécurité</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn-primary btn-large"
              onClick={handleSubmitLaw}
              disabled={!lawData.title.trim()}
            >
              🗳️ Soumettre au vote de l'Assemblée
            </button>
          </div>
        </div>

        {/* Prédiction en temps réel */}
        <div className="prediction-panel">
          <h3>📊 Prédiction du vote</h3>

          {votePrediction ? (
            <>
              <div className={`majority-indicator ${majorityStatus.color}`}>
                <div className="indicator-icon">
                  {majorityStatus.color === 'green' && '✅'}
                  {majorityStatus.color === 'orange' && '⚠️'}
                  {majorityStatus.color === 'red' && '❌'}
                </div>
                <div className="indicator-text">{majorityStatus.status}</div>
              </div>

              <div className="prediction-votes">
                <div className="vote-bar">
                  <div
                    className="vote-segment pour"
                    style={{ width: `${(votePrediction.pour / 577) * 100}%` }}
                  >
                    <span>{votePrediction.pour}</span>
                  </div>
                  <div
                    className="vote-segment contre"
                    style={{ width: `${(votePrediction.contre / 577) * 100}%` }}
                  >
                    <span>{votePrediction.contre}</span>
                  </div>
                  <div
                    className="vote-segment abstention"
                    style={{ width: `${(votePrediction.abstention / 577) * 100}%` }}
                  >
                    <span>{votePrediction.abstention}</span>
                  </div>
                </div>

                <div className="vote-legend">
                  <div className="legend-item">
                    <div className="legend-color pour"></div>
                    <span>Pour: {votePrediction.pour}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color contre"></div>
                    <span>Contre: {votePrediction.contre}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color abstention"></div>
                    <span>Abstention: {votePrediction.abstention}</span>
                  </div>
                </div>
              </div>

              <div className="hemicycle-preview">
                <h4>Hémicycle (prédiction)</h4>
                <ParliamentHemicycle
                  highlightedDeputies={[]}
                  showVotePrediction={true}
                  lawId={previewLaw?.id}
                />
              </div>

              <div className="prediction-details">
                <h4>Analyse détaillée</h4>
                <ul>
                  <li>✅ Soutiens acquis : {deputiesByVote.pour.length} députés</li>
                  <li>❌ Opposants : {deputiesByVote.contre.length} députés</li>
                  <li>⚪ Indécis : {deputiesByVote.abstention.length} députés</li>
                  <li>🎯 Majorité requise : 289 voix</li>
                  <li>
                    {votePrediction.pour >= 289
                      ? `✅ Marge : +${votePrediction.pour - 289} voix`
                      : `⚠️ Manque : ${289 - votePrediction.pour} voix`
                    }
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="no-prediction">
              <p>Remplissez le formulaire pour voir la prédiction de vote</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
