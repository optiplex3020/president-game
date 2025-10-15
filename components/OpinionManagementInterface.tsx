import React, { useState, useMemo } from 'react';
import { useMasterGame } from '../src/hooks/useMasterGame';
import type { DemographicGroup } from '../src/types/opinion';
import '../src/styles/OpinionManagementInterface.css';

export const OpinionManagementInterface: React.FC = () => {
  const { opinion, master } = useMasterGame();

  const [selectedSegment, setSelectedSegment] = useState<DemographicGroup | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');
  const [filterSupport, setFilterSupport] = useState<'all' | 'favorable' | 'neutral' | 'hostile'>('all');
  const [sortBy, setSortBy] = useState<'support' | 'volatility' | 'size'>('support');

  // Récupérer tous les segments
  const allSegments = useMemo(() => {
    if (!opinion?.demographics) return [];
    return Object.values(opinion.demographics);
  }, [opinion]);

  // Filtrer et trier les segments
  const filteredSegments = useMemo(() => {
    let segments = [...allSegments];

    // Filtrer par support
    if (filterSupport !== 'all') {
      segments = segments.filter(segment => {
        const support = segment.opinion.trustInPresident;
        if (filterSupport === 'favorable') return support >= 60;
        if (filterSupport === 'neutral') return support >= 40 && support < 60;
        if (filterSupport === 'hostile') return support < 40;
        return true;
      });
    }

    // Trier
    segments.sort((a, b) => {
      if (sortBy === 'support') {
        return b.opinion.trustInPresident - a.opinion.trustInPresident;
      } else if (sortBy === 'volatility') {
        return b.characteristics.volatility - a.characteristics.volatility;
      } else if (sortBy === 'size') {
        return b.percentage - a.percentage;
      }
      return 0;
    });

    return segments;
  }, [allSegments, filterSupport, sortBy]);

  // Calculer le support global
  const overallSupport = useMemo(() => {
    if (allSegments.length === 0) return 0;
    const totalWeight = allSegments.reduce((sum, s) => sum + s.percentage, 0);
    const weightedSupport = allSegments.reduce((sum, s) => sum + (s.opinion.trustInPresident * s.percentage), 0);
    return Math.round(weightedSupport / totalWeight);
  }, [allSegments]);

  // Statistiques
  const stats = useMemo(() => {
    const favorable = allSegments.filter(s => s.opinion.trustInPresident >= 60);
    const neutral = allSegments.filter(s => s.opinion.trustInPresident >= 40 && s.opinion.trustInPresident < 60);
    const hostile = allSegments.filter(s => s.opinion.trustInPresident < 40);

    const favorableWeight = favorable.reduce((sum, s) => sum + s.percentage, 0);
    const neutralWeight = neutral.reduce((sum, s) => sum + s.percentage, 0);
    const hostileWeight = hostile.reduce((sum, s) => sum + s.percentage, 0);

    return {
      favorable: { count: favorable.length, weight: favorableWeight },
      neutral: { count: neutral.length, weight: neutralWeight },
      hostile: { count: hostile.length, weight: hostileWeight }
    };
  }, [allSegments]);

  const getSupportColor = (support: number) => {
    if (support >= 70) return 'very-high';
    if (support >= 60) return 'high';
    if (support >= 50) return 'moderate';
    if (support >= 40) return 'low';
    return 'very-low';
  };

  const getSupportLabel = (support: number) => {
    if (support >= 70) return 'Très favorable';
    if (support >= 60) return 'Favorable';
    if (support >= 50) return 'Plutôt favorable';
    if (support >= 40) return 'Neutre';
    if (support >= 30) return 'Défavorable';
    return 'Très défavorable';
  };

  const getSegmentIcon = (id: string) => {
    const icons: Record<string, string> = {
      'ouvriers': '🔨',
      'employes': '💼',
      'cadres_sup': '👔',
      'professions_liberales': '⚖️',
      'artisans_commercants': '🏪',
      'agriculteurs': '🚜',
      'retraites': '👴',
      'etudiants': '🎓',
      'chomeurs': '📉',
      'fonctionnaires': '🏛️',
      'secteur_prive': '🏢',
      'urbains': '🏙️',
      'ruraux': '🌾',
      'periurbains': '🏘️',
      'jeunes_18_24': '👶',
      'adultes_25_39': '🧑',
      'seniors_40_59': '👨',
      'retraites_60plus': '👴',
      'bac_moins': '📚',
      'bac_bac2': '🎓',
      'bac3_plus': '🎯',
      'religieux_pratiquants': '⛪',
      'laics': '🔬'
    };
    return icons[id] || '👥';
  };

  return (
    <div className="opinion-management-interface">
      {/* En-tête avec statistiques globales */}
      <div className="opinion-header">
        <div className="overall-support-card">
          <div className="overall-support-label">Soutien global</div>
          <div className={`overall-support-value ${getSupportColor(overallSupport)}`}>
            {overallSupport}%
          </div>
          <div className="overall-support-subtitle">{getSupportLabel(overallSupport)}</div>
        </div>

        <div className="support-breakdown">
          <div className="breakdown-item favorable">
            <div className="breakdown-icon">✅</div>
            <div className="breakdown-stats">
              <div className="breakdown-label">Favorables</div>
              <div className="breakdown-value">
                {stats.favorable.count} segments ({Math.round(stats.favorable.weight)}%)
              </div>
            </div>
          </div>

          <div className="breakdown-item neutral">
            <div className="breakdown-icon">⚪</div>
            <div className="breakdown-stats">
              <div className="breakdown-label">Neutres</div>
              <div className="breakdown-value">
                {stats.neutral.count} segments ({Math.round(stats.neutral.weight)}%)
              </div>
            </div>
          </div>

          <div className="breakdown-item hostile">
            <div className="breakdown-icon">❌</div>
            <div className="breakdown-stats">
              <div className="breakdown-label">Hostiles</div>
              <div className="breakdown-value">
                {stats.hostile.count} segments ({Math.round(stats.hostile.weight)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="opinion-controls">
        <div className="control-group">
          <label>Vue</label>
          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              📊 Grille
            </button>
            <button
              className={viewMode === 'chart' ? 'active' : ''}
              onClick={() => setViewMode('chart')}
            >
              📈 Graphique
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Filtrer</label>
          <select
            value={filterSupport}
            onChange={(e) => setFilterSupport(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Tous les segments</option>
            <option value="favorable">Favorables (≥60%)</option>
            <option value="neutral">Neutres (40-60%)</option>
            <option value="hostile">Hostiles (&lt;40%)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Trier par</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="support">Soutien</option>
            <option value="volatility">Volatilité</option>
            <option value="size">Poids démographique</option>
          </select>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="opinion-content">
        {viewMode === 'grid' ? (
          <div className="segments-grid">
            {filteredSegments.map(segment => (
              <div
                key={segment.id}
                className={`segment-card ${getSupportColor(segment.opinion.trustInPresident)} ${selectedSegment?.id === segment.id ? 'selected' : ''}`}
                onClick={() => setSelectedSegment(segment)}
              >
                <div className="segment-header">
                  <span className="segment-icon">{getSegmentIcon(segment.id)}</span>
                  <div className="segment-title">
                    <h4>{segment.name}</h4>
                    <span className="segment-size">{segment.percentage.toFixed(1)}% de la population</span>
                  </div>
                </div>

                <div className="segment-support">
                  <div className="support-bar-container">
                    <div
                      className={`support-bar ${getSupportColor(segment.opinion.trustInPresident)}`}
                      style={{ width: `${segment.opinion.trustInPresident}%` }}
                    >
                      <span className="support-percentage">{segment.opinion.trustInPresident}%</span>
                    </div>
                  </div>
                  <div className="support-label-text">{getSupportLabel(segment.opinion.trustInPresident)}</div>
                </div>

                <div className="segment-stats-mini">
                  <div className="stat-mini">
                    <span className="stat-mini-label">Volatilité</span>
                    <span className="stat-mini-value">{segment.characteristics.volatility || 50}%</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-label">Préoccupations</span>
                    <span className="stat-mini-value">{segment.opinion.priorities.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="segments-chart">
            <div className="chart-container">
              <div className="chart-y-axis">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              <div className="chart-bars">
                {filteredSegments.map((segment, index) => (
                  <div
                    key={segment.id}
                    className="chart-bar-wrapper"
                    onClick={() => setSelectedSegment(segment)}
                  >
                    <div
                      className={`chart-bar ${getSupportColor(segment.opinion.trustInPresident)} ${selectedSegment?.id === segment.id ? 'selected' : ''}`}
                      style={{ height: `${segment.opinion.trustInPresident}%` }}
                    >
                      <div className="chart-bar-value">{segment.opinion.trustInPresident}%</div>
                    </div>
                    <div className="chart-bar-label">
                      <span className="chart-bar-icon">{getSegmentIcon(segment.id)}</span>
                      <span className="chart-bar-name">{segment.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Panel de détails du segment sélectionné */}
        {selectedSegment && (
          <div className="segment-detail-panel">
            <div className="detail-panel-header">
              <h3>
                {getSegmentIcon(selectedSegment.id)} {selectedSegment.name}
              </h3>
              <button
                className="close-detail-btn"
                onClick={() => setSelectedSegment(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-panel-content">
              <div className="detail-stat-row">
                <span className="detail-stat-label">Soutien au Président</span>
                <span className={`detail-stat-value ${getSupportColor(selectedSegment.opinion.trustInPresident)}`}>
                  {selectedSegment.opinion.trustInPresident}% - {getSupportLabel(selectedSegment.opinion.trustInPresident)}
                </span>
              </div>

              <div className="detail-stat-row">
                <span className="detail-stat-label">Poids démographique</span>
                <span className="detail-stat-value">{selectedSegment.percentage.toFixed(1)}%</span>
              </div>

              <div className="detail-stat-row">
                <span className="detail-stat-label">Volatilité</span>
                <span className="detail-stat-value">{selectedSegment.characteristics.volatility || 50}%</span>
              </div>

              <div className="detail-section">
                <h4>🎯 Préoccupations principales</h4>
                <div className="concerns-list">
                  {selectedSegment.opinion.priorities.slice(0, 5).sort((a, b) => b.importance - a.importance).map((priority, index) => (
                    <div key={index} className="concern-item">
                      <span className="concern-rank">#{index + 1}</span>
                      <span className="concern-text">{priority.category} ({priority.importance}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>💡 Recommandations</h4>
                <div className="recommendations-list">
                  {selectedSegment.opinion.trustInPresident < 40 && (
                    <div className="recommendation hostile">
                      <strong>⚠️ Segment hostile</strong>
                      <p>Proposez des mesures ciblées sur leurs préoccupations pour regagner leur confiance.</p>
                    </div>
                  )}
                  {selectedSegment.opinion.trustInPresident >= 40 && selectedSegment.opinion.trustInPresident < 60 && (
                    <div className="recommendation neutral">
                      <strong>⚪ Segment hésitant</strong>
                      <p>Communiquez activement sur vos réussites et clarifiez votre vision.</p>
                    </div>
                  )}
                  {selectedSegment.opinion.trustInPresident >= 60 && (
                    <div className="recommendation favorable">
                      <strong>✅ Segment acquis</strong>
                      <p>Consolidez votre base en répondant à leurs attentes prioritaires.</p>
                    </div>
                  )}
                  {(selectedSegment.characteristics.volatility || 50) > 60 && (
                    <div className="recommendation volatile">
                      <strong>📊 Haute volatilité</strong>
                      <p>Ce segment peut basculer rapidement. Surveillez l'impact de vos décisions.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
