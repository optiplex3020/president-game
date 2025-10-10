import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useOpinionEngine } from '../src/systems/OpinionEngine';
import type { DemographicSegment } from '../src/types/opinion';
import '../src/styles/OpinionMap.css';

export const OpinionMap: React.FC = () => {
  const { demographics, popularityHistory, publicMood, calculateOverallApproval } = useOpinionEngine();

  const overallApproval = calculateOverallApproval();

  // Données pour le graphique par âge
  const ageData = useMemo(() => {
    return [
      { age: '18-24', trust: Math.round(demographics.jeunes_18_24?.opinion.trustInPresident || 0) },
      { age: '25-34', trust: Math.round(demographics.jeunes_25_34?.opinion.trustInPresident || 0) },
      { age: '35-49', trust: Math.round(demographics.adultes_35_49?.opinion.trustInPresident || 0) },
      { age: '50-64', trust: Math.round(demographics.seniors_50_64?.opinion.trustInPresident || 0) },
      { age: '65+', trust: Math.round(demographics.retraites_65_plus?.opinion.trustInPresident || 0) }
    ];
  }, [demographics]);

  // Données pour le graphique par CSP
  const cspData = useMemo(() => {
    return [
      { csp: 'Ouvriers', trust: Math.round(demographics.ouvriers?.opinion.trustInPresident || 0) },
      { csp: 'Employés', trust: Math.round(demographics.employes?.opinion.trustInPresident || 0) },
      { csp: 'Cadres', trust: Math.round(demographics.cadres?.opinion.trustInPresident || 0) },
      { csp: 'Prof. lib.', trust: Math.round(demographics.professions_liberales?.opinion.trustInPresident || 0) },
      { csp: 'Artisans', trust: Math.round(demographics.artisans_commercants?.opinion.trustInPresident || 0) }
    ];
  }, [demographics]);

  // Données pour le graphique par géographie
  const geoData = useMemo(() => {
    return [
      { zone: 'Urbains', trust: Math.round(demographics.urbains?.opinion.trustInPresident || 0) },
      { zone: 'Périurbains', trust: Math.round(demographics.periurbains?.opinion.trustInPresident || 0) },
      { zone: 'Ruraux', trust: Math.round(demographics.ruraux?.opinion.trustInPresident || 0) },
      { zone: 'IDF', trust: Math.round(demographics.ile_de_france?.opinion.trustInPresident || 0) }
    ];
  }, [demographics]);

  // Historique de popularité (derniers 30 jours)
  const historyData = useMemo(() => {
    return popularityHistory.slice(-30).map((h, i) => ({
      jour: `J${i + 1}`,
      popularite: Math.round(h.overall)
    }));
  }, [popularityHistory]);

  // Carte simplifiée de France avec régions colorées
  const getRegionColor = (trust: number) => {
    if (trust >= 60) return '#00aa00';
    if (trust >= 50) return '#88cc00';
    if (trust >= 40) return '#ffaa00';
    if (trust >= 30) return '#ff6600';
    return '#cc0000';
  };

  const getMoodEmoji = () => {
    switch (publicMood.generalMood) {
      case 'optimiste': return '😊';
      case 'apaise': return '😌';
      case 'inquiet': return '😟';
      case 'pessimiste': return '😞';
      case 'colère': return '😠';
      default: return '😐';
    }
  };

  const getMoodColor = () => {
    const score = publicMood.moodScore;
    if (score > 20) return '#00cc00';
    if (score > 0) return '#88cc00';
    if (score > -20) return '#ffaa00';
    if (score > -40) return '#ff6600';
    return '#cc0000';
  };

  return (
    <div className="opinion-map">
      <div className="opinion-header">
        <h2>État de l'Opinion Publique</h2>
        <div className="overall-approval">
          <div className="approval-gauge">
            <div
              className="gauge-fill"
              style={{
                width: `${overallApproval}%`,
                backgroundColor: getRegionColor(overallApproval)
              }}
            />
          </div>
          <div className="approval-text">
            <span className="approval-value">{Math.round(overallApproval)}%</span>
            <span className="approval-label">Approbation Globale</span>
          </div>
        </div>

        <div className="public-mood">
          <div className="mood-emoji">{getMoodEmoji()}</div>
          <div className="mood-info">
            <div className="mood-label">Humeur Publique</div>
            <div className="mood-value" style={{ color: getMoodColor() }}>
              {publicMood.generalMood.toUpperCase()}
            </div>
            <div className="mood-score">Score: {publicMood.moodScore}/100</div>
          </div>
          <div className="mood-metrics">
            <div className="metric">
              <span className="metric-label">Polarisation</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: `${publicMood.polarization}%`, backgroundColor: '#ff6600' }}
                />
              </div>
              <span className="metric-value">{Math.round(publicMood.polarization)}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Intensité Émotionnelle</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: `${publicMood.emotionalIntensity}%`, backgroundColor: '#cc00cc' }}
                />
              </div>
              <span className="metric-value">{Math.round(publicMood.emotionalIntensity)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="opinion-charts">
        {/* Graphique par âge */}
        <div className="chart-container">
          <h3>Confiance par Âge</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="age" stroke="#ccc" />
              <YAxis stroke="#ccc" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #444' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="trust" fill="#4ecdc4" name="Confiance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique par CSP */}
        <div className="chart-container">
          <h3>Confiance par CSP</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cspData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="csp" stroke="#ccc" />
              <YAxis stroke="#ccc" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #444' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="trust" fill="#ff6b6b" name="Confiance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique par géographie */}
        <div className="chart-container">
          <h3>Confiance par Zone</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={geoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="zone" stroke="#ccc" />
              <YAxis stroke="#ccc" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #444' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="trust" fill="#95e1d3" name="Confiance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Historique */}
        {historyData.length > 0 && (
          <div className="chart-container chart-wide">
            <h3>Évolution de la Popularité (30 derniers jours)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="jour" stroke="#ccc" />
                <YAxis stroke="#ccc" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="popularite"
                  stroke="#ffcc00"
                  strokeWidth={3}
                  name="Popularité %"
                  dot={{ fill: '#ffcc00', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Sujets dominants */}
      <div className="dominant-topics">
        <h3>Sujets Dominants dans l'Opinion</h3>
        <div className="topics-grid">
          {publicMood.dominantTopics.slice(0, 5).map((topic, i) => (
            <div key={i} className="topic-card">
              <div className="topic-title">{topic.topic}</div>
              <div className="topic-metrics">
                <div className="topic-volume">
                  <span className="metric-label">Volume de discussion</span>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{ width: `${topic.discussionVolume}%`, backgroundColor: '#4ecdc4' }}
                    />
                  </div>
                  <span className="metric-value">{topic.discussionVolume}%</span>
                </div>
                <div className="topic-sentiment">
                  <span className="metric-label">Sentiment</span>
                  <div className="sentiment-value" style={{
                    color: topic.sentiment > 0 ? '#00cc00' : topic.sentiment < 0 ? '#cc0000' : '#999'
                  }}>
                    {topic.sentiment > 0 ? '+' : ''}{topic.sentiment}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demandes sociales */}
      <div className="social-demands">
        <h3>Demandes Sociales</h3>
        <div className="demands-list">
          {publicMood.socialDemands.slice(0, 5).map((demand, i) => (
            <div key={i} className="demand-item">
              <div className="demand-header">
                <span className="demand-title">{demand.demand}</span>
                <span className="demand-support">{demand.support}% de soutien</span>
              </div>
              <div className="demand-metrics">
                <div className="demand-metric">
                  <span>Intensité</span>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{ width: `${demand.intensity}%`, backgroundColor: '#ff6b6b' }}
                    />
                  </div>
                </div>
                <div className="demand-metric">
                  <span>Potentiel de mobilisation</span>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{ width: `${demand.mobilizationPotential}%`, backgroundColor: '#ff0000' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
