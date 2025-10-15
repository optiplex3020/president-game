import React, { useMemo } from 'react';
import { useReputationEngine, generateHistoricalJudgment } from '../src/systems/ReputationEngine';
import '../src/styles/LegacyPanel.css';

export const LegacyPanel: React.FC = () => {
  const {
    currentReputation,
    accomplishments,
    controversies,
    legacy,
    calculateLegacy,
    getReputationSummary
  } = useReputationEngine();

  const summary = useMemo(() => getReputationSummary(), [currentReputation]);
  const currentLegacy = useMemo(() => legacy || calculateLegacy(), [legacy, accomplishments, controversies]);
  const historicalJudgments = useMemo(() =>
    generateHistoricalJudgment(currentLegacy), [currentLegacy]
  );

  const getReputationColor = (value: number) => {
    if (value >= 80) return 'excellent';
    if (value >= 70) return 'good';
    if (value >= 60) return 'average';
    if (value >= 50) return 'mediocre';
    return 'poor';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'economie': '💰',
      'social': '👥',
      'international': '🌍',
      'environnement': '🌱',
      'culture': '🎭',
      'securite': '🛡️',
      'justice': '⚖️',
      'education': '🎓'
    };
    return icons[category] || '📊';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'economie': 'Économie',
      'social': 'Social',
      'international': 'International',
      'environnement': 'Environnement',
      'culture': 'Culture',
      'securite': 'Sécurité',
      'justice': 'Justice',
      'education': 'Éducation'
    };
    return labels[category] || category;
  };

  const recentAccomplishments = accomplishments.slice(-5).reverse();
  const unresolvedControversies = controversies.filter(c => !c.resolved);

  return (
    <div className="legacy-panel">
      {/* Score global d'héritage */}
      <div className="legacy-overview">
        <div className="legacy-score-card">
          <div className="legacy-score-label">Score d'Héritage</div>
          <div className={`legacy-score-value ${getReputationColor(currentLegacy.overall)}`}>
            {currentLegacy.overall}/100
          </div>
          <div className="legacy-title">{currentLegacy.title}</div>
          <div className="legacy-ranking">
            {currentLegacy.historicalRanking}e président de la Ve République
          </div>
        </div>

        <div className="legacy-balance">
          <div className="balance-title">Équilibre du mandat</div>
          <div className="balance-bar">
            <div
              className={`balance-fill ${getReputationColor(summary.balanceScore)}`}
              style={{ width: `${summary.balanceScore}%` }}
            >
              <span className="balance-value">{summary.balanceScore}%</span>
            </div>
          </div>
          <div className="balance-description">
            {summary.balanceScore >= 70
              ? 'Excellence équilibrée sur tous les domaines'
              : summary.balanceScore >= 50
              ? 'Quelques domaines négligés'
              : 'Mandat très déséquilibré'}
          </div>
        </div>
      </div>

      {/* Réputation par catégorie */}
      <div className="reputation-categories">
        <h3>📊 Réputation par domaine</h3>
        <div className="categories-grid">
          {Object.entries(currentReputation).map(([category, value]) => (
            <div key={category} className={`category-card ${getReputationColor(value)}`}>
              <div className="category-header">
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-name">{getCategoryLabel(category)}</span>
              </div>
              <div className="category-score">
                <div className="score-bar">
                  <div
                    className={`score-fill ${getReputationColor(value)}`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className="score-value">{value}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forces et faiblesses */}
      <div className="strengths-weaknesses">
        <div className="strengths-section">
          <h4>✅ Points forts</h4>
          <div className="points-list">
            {summary.strengths.map(category => (
              <div key={category} className="point-item strength">
                <span className="point-icon">{getCategoryIcon(category)}</span>
                <span className="point-label">{getCategoryLabel(category)}</span>
                <span className="point-score">{currentReputation[category]}/100</span>
              </div>
            ))}
          </div>
        </div>

        <div className="weaknesses-section">
          <h4>⚠️ Points faibles</h4>
          <div className="points-list">
            {summary.weaknesses.map(category => (
              <div key={category} className="point-item weakness">
                <span className="point-icon">{getCategoryIcon(category)}</span>
                <span className="point-label">{getCategoryLabel(category)}</span>
                <span className="point-score">{currentReputation[category]}/100</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Réalisations récentes */}
      <div className="recent-accomplishments">
        <h3>✨ Réalisations récentes ({accomplishments.length} total)</h3>
        {recentAccomplishments.length > 0 ? (
          <div className="accomplishments-list">
            {recentAccomplishments.map(acc => (
              <div key={acc.id} className={`accomplishment-card ${acc.publicPerception}`}>
                <div className="accomplishment-header">
                  <span className="accomplishment-icon">{getCategoryIcon(acc.category)}</span>
                  <div className="accomplishment-info">
                    <h5>{acc.title}</h5>
                    <span className="accomplishment-date">
                      {new Intl.DateTimeFormat('fr-FR', {
                        month: 'short',
                        year: 'numeric'
                      }).format(new Date(acc.date))}
                    </span>
                  </div>
                  <span className={`accomplishment-impact ${acc.publicPerception}`}>
                    Impact: {acc.impact}
                  </span>
                </div>
                <p className="accomplishment-description">{acc.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Aucune réalisation majeure enregistrée pour le moment</p>
          </div>
        )}
      </div>

      {/* Controverses non résolues */}
      {unresolvedControversies.length > 0 && (
        <div className="unresolved-controversies">
          <h3>⚠️ Controverses non résolues ({unresolvedControversies.length})</h3>
          <div className="controversies-list">
            {unresolvedControversies.map(ctrl => (
              <div key={ctrl.id} className="controversy-card">
                <div className="controversy-header">
                  <h5>{ctrl.title}</h5>
                  <span className={`controversy-severity ${ctrl.severity >= 70 ? 'high' : 'medium'}`}>
                    Gravité: {ctrl.severity}
                  </span>
                </div>
                <p className="controversy-description">{ctrl.description}</p>
                <div className="controversy-date">
                  Depuis {new Intl.DateTimeFormat('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                  }).format(new Date(ctrl.date))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jugement historique */}
      <div className="historical-judgment">
        <h3>📚 Jugement historique</h3>
        <div className="judgment-grid">
          {historicalJudgments.map(judgment => (
            <div key={judgment.category} className="judgment-card">
              <div className="judgment-header">
                <span className="judgment-icon">{getCategoryIcon(judgment.category)}</span>
                <span className="judgment-category">{getCategoryLabel(judgment.category)}</span>
                <span className={`judgment-rating ${getReputationColor(judgment.rating)}`}>
                  {judgment.rating}/100
                </span>
              </div>

              {judgment.achievements.length > 0 && (
                <div className="judgment-section">
                  <strong>Réussites:</strong>
                  <ul>
                    {judgment.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {judgment.failures.length > 0 && (
                <div className="judgment-section">
                  <strong>Échecs:</strong>
                  <ul className="failures-list">
                    {judgment.failures.map((fail, i) => (
                      <li key={i}>{fail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {judgment.signature !== 'Aucune action emblématique' && (
                <div className="judgment-signature">
                  <strong>Action emblématique:</strong>
                  <p>{judgment.signature}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
