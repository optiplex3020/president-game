import React, { useState, useMemo } from 'react';
import { useQuestEngine, type Quest, type QuestCategory } from '../src/systems/QuestEngine';
import '../src/styles/QuestPanel.css';

export const QuestPanel: React.FC = () => {
  const {
    quests,
    activeQuestIds,
    totalQuestsCompleted,
    currentStreak,
    activateQuest,
    abandonQuest,
    getActiveQuests,
    getAvailableQuests,
    getCompletedQuests
  } = useQuestEngine();

  const [selectedTab, setSelectedTab] = useState<'active' | 'available' | 'completed'>('active');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const activeQuests = getActiveQuests();
  const availableQuests = getAvailableQuests();
  const completedQuests = getCompletedQuests();

  // Filtrer par catégorie
  const filteredQuests = useMemo(() => {
    let questList: Quest[] = [];

    if (selectedTab === 'active') questList = activeQuests;
    else if (selectedTab === 'available') questList = availableQuests;
    else questList = completedQuests;

    if (selectedCategory === 'all') return questList;
    return questList.filter(q => q.category === selectedCategory);
  }, [selectedTab, selectedCategory, activeQuests, availableQuests, completedQuests]);

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
      legendary: '#8b5cf6'
    };
    return colors[difficulty];
  };

  const getDifficultyLabel = (difficulty: Quest['difficulty']) => {
    const labels = {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      legendary: 'Légendaire'
    };
    return labels[difficulty];
  };

  const getCategoryLabel = (category: QuestCategory) => {
    const labels: Record<QuestCategory, string> = {
      main: 'Principale',
      legislative: 'Législative',
      popularity: 'Popularité',
      economy: 'Économie',
      parliament: 'Parlement',
      diplomacy: 'Diplomatie',
      crisis: 'Crise',
      reputation: 'Réputation',
      tutorial: 'Tutoriel',
      hidden: 'Secrète'
    };
    return labels[category];
  };

  const handleActivateQuest = (questId: string) => {
    activateQuest(questId);
    const quest = quests[questId];
    if (quest) setSelectedQuest(quest);
  };

  const handleAbandonQuest = (questId: string) => {
    abandonQuest(questId);
    setSelectedQuest(null);
  };

  return (
    <div className="quest-panel">
      {/* Header avec stats */}
      <div className="quest-panel-header">
        <h2>Objectifs & Quêtes</h2>
        <div className="quest-stats">
          <div className="quest-stat">
            <span className="quest-stat-icon">✅</span>
            <span className="quest-stat-value">{totalQuestsCompleted}</span>
            <span className="quest-stat-label">Complétées</span>
          </div>
          <div className="quest-stat">
            <span className="quest-stat-icon">⚡</span>
            <span className="quest-stat-value">{activeQuestIds.length}</span>
            <span className="quest-stat-label">Actives</span>
          </div>
          <div className="quest-stat">
            <span className="quest-stat-icon">🔥</span>
            <span className="quest-stat-value">{currentStreak}</span>
            <span className="quest-stat-label">Série</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="quest-tabs">
        <button
          className={`quest-tab ${selectedTab === 'active' ? 'active' : ''}`}
          onClick={() => setSelectedTab('active')}
        >
          En cours <span className="quest-tab-count">{activeQuests.length}</span>
        </button>
        <button
          className={`quest-tab ${selectedTab === 'available' ? 'active' : ''}`}
          onClick={() => setSelectedTab('available')}
        >
          Disponibles <span className="quest-tab-count">{availableQuests.length}</span>
        </button>
        <button
          className={`quest-tab ${selectedTab === 'completed' ? 'active' : ''}`}
          onClick={() => setSelectedTab('completed')}
        >
          Terminées <span className="quest-tab-count">{completedQuests.length}</span>
        </button>
      </div>

      {/* Filtres par catégorie */}
      <div className="quest-category-filters">
        <button
          className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Toutes
        </button>
        {['main', 'legislative', 'popularity', 'economy', 'crisis'].map(cat => (
          <button
            key={cat}
            className={`category-filter ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat as QuestCategory)}
          >
            {getCategoryLabel(cat as QuestCategory)}
          </button>
        ))}
      </div>

      {/* Liste des quêtes */}
      <div className="quest-list">
        {filteredQuests.length === 0 ? (
          <div className="quest-list-empty">
            <div className="quest-empty-icon">📋</div>
            <p>
              {selectedTab === 'active' && 'Aucune quête active. Activez une quête disponible pour commencer !'}
              {selectedTab === 'available' && 'Aucune quête disponible pour le moment. Continuez à jouer pour en débloquer !'}
              {selectedTab === 'completed' && 'Aucune quête complétée. Relevez des défis pour gagner des récompenses !'}
            </p>
          </div>
        ) : (
          filteredQuests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isSelected={selectedQuest?.id === quest.id}
              onSelect={() => setSelectedQuest(quest)}
              onActivate={() => handleActivateQuest(quest.id)}
              onAbandon={() => handleAbandonQuest(quest.id)}
              getDifficultyColor={getDifficultyColor}
              getDifficultyLabel={getDifficultyLabel}
              getCategoryLabel={getCategoryLabel}
            />
          ))
        )}
      </div>

      {/* Panneau de détails */}
      {selectedQuest && (
        <QuestDetailPanel
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onActivate={() => handleActivateQuest(selectedQuest.id)}
          onAbandon={() => handleAbandonQuest(selectedQuest.id)}
          getDifficultyColor={getDifficultyColor}
          getDifficultyLabel={getDifficultyLabel}
          getCategoryLabel={getCategoryLabel}
        />
      )}
    </div>
  );
};

// Composant carte de quête
interface QuestCardProps {
  quest: Quest;
  isSelected: boolean;
  onSelect: () => void;
  onActivate: () => void;
  onAbandon: () => void;
  getDifficultyColor: (d: Quest['difficulty']) => string;
  getDifficultyLabel: (d: Quest['difficulty']) => string;
  getCategoryLabel: (c: QuestCategory) => string;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  isSelected,
  onSelect,
  onActivate,
  onAbandon,
  getDifficultyColor,
  getDifficultyLabel,
  getCategoryLabel
}) => {
  const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
  const totalObjectives = quest.objectives.length;

  return (
    <div
      className={`quest-card ${isSelected ? 'selected' : ''} ${quest.status}`}
      onClick={onSelect}
    >
      <div className="quest-card-header">
        <div className="quest-card-icon">{quest.icon || '📌'}</div>
        <div className="quest-card-title-section">
          <h3 className="quest-card-title">{quest.title}</h3>
          <div className="quest-card-meta">
            <span
              className="quest-difficulty-badge"
              style={{ background: getDifficultyColor(quest.difficulty) }}
            >
              {getDifficultyLabel(quest.difficulty)}
            </span>
            <span className="quest-category-badge">{getCategoryLabel(quest.category)}</span>
          </div>
        </div>
      </div>

      <p className="quest-card-description">{quest.description}</p>

      {/* Barre de progression */}
      {quest.status === 'active' && (
        <div className="quest-progress-section">
          <div className="quest-progress-bar">
            <div
              className="quest-progress-fill"
              style={{ width: `${quest.progress}%` }}
            />
          </div>
          <div className="quest-progress-text">
            {completedObjectives} / {totalObjectives} objectifs ({quest.progress}%)
          </div>
        </div>
      )}

      {/* Timer si applicable */}
      {quest.status === 'active' && quest.daysRemaining !== undefined && (
        <div className="quest-timer">
          ⏰ {quest.daysRemaining} jour{quest.daysRemaining > 1 ? 's' : ''} restant{quest.daysRemaining > 1 ? 's' : ''}
        </div>
      )}

      {/* Actions */}
      <div className="quest-card-actions">
        {quest.status === 'available' && (
          <button className="quest-btn-activate" onClick={(e) => { e.stopPropagation(); onActivate(); }}>
            Activer
          </button>
        )}
        {quest.status === 'active' && (
          <button className="quest-btn-abandon" onClick={(e) => { e.stopPropagation(); onAbandon(); }}>
            Abandonner
          </button>
        )}
        {quest.status === 'completed' && (
          <span className="quest-completed-label">✅ Complétée</span>
        )}
      </div>
    </div>
  );
};

// Panneau de détails de quête
interface QuestDetailPanelProps {
  quest: Quest;
  onClose: () => void;
  onActivate: () => void;
  onAbandon: () => void;
  getDifficultyColor: (d: Quest['difficulty']) => string;
  getDifficultyLabel: (d: Quest['difficulty']) => string;
  getCategoryLabel: (c: QuestCategory) => string;
}

const QuestDetailPanel: React.FC<QuestDetailPanelProps> = ({
  quest,
  onClose,
  onActivate,
  onAbandon,
  getDifficultyColor,
  getDifficultyLabel,
  getCategoryLabel
}) => {
  return (
    <div className="quest-detail-panel">
      <div className="quest-detail-backdrop" onClick={onClose} />
      <div className="quest-detail-content">
        <button className="quest-detail-close" onClick={onClose}>×</button>

        <div className="quest-detail-header">
          <div className="quest-detail-icon">{quest.icon || '📌'}</div>
          <div>
            <h2>{quest.title}</h2>
            <div className="quest-detail-meta">
              <span
                className="quest-difficulty-badge"
                style={{ background: getDifficultyColor(quest.difficulty) }}
              >
                {getDifficultyLabel(quest.difficulty)}
              </span>
              <span className="quest-category-badge">{getCategoryLabel(quest.category)}</span>
            </div>
          </div>
        </div>

        <p className="quest-detail-description">{quest.description}</p>

        {/* Objectifs */}
        <div className="quest-detail-section">
          <h3>Objectifs</h3>
          <div className="quest-objectives-list">
            {quest.objectives.map(obj => (
              <div key={obj.id} className={`quest-objective ${obj.completed ? 'completed' : ''}`}>
                <div className="quest-objective-checkbox">
                  {obj.completed ? '✅' : '⬜'}
                </div>
                <div className="quest-objective-content">
                  <div className="quest-objective-description">{obj.description}</div>
                  <div className="quest-objective-progress">
                    {obj.currentValue} / {obj.targetValue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Récompenses */}
        <div className="quest-detail-section">
          <h3>Récompenses</h3>
          <div className="quest-rewards-list">
            {quest.rewards.map((reward, index) => (
              <div key={index} className="quest-reward">
                <span className="quest-reward-icon">
                  {reward.type === 'politicalCapital' && '💎'}
                  {reward.type === 'reputation' && '⭐'}
                  {reward.type === 'achievement' && '🏆'}
                  {reward.type === 'unlock' && '🔓'}
                  {reward.type === 'bonus' && '🎁'}
                </span>
                <span className="quest-reward-description">{reward.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="quest-detail-actions">
          {quest.status === 'available' && (
            <button className="quest-btn-activate-large" onClick={onActivate}>
              Activer cette quête
            </button>
          )}
          {quest.status === 'active' && (
            <button className="quest-btn-abandon-large" onClick={onAbandon}>
              Abandonner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Widget compact pour affichage dans le dashboard
export const QuestWidgetCompact: React.FC = () => {
  const { getActiveQuests } = useQuestEngine();
  const activeQuests = getActiveQuests();

  if (activeQuests.length === 0) return null;

  const topQuest = activeQuests[0];

  return (
    <div className="quest-widget-compact">
      <div className="quest-widget-header">
        <span className="quest-widget-icon">{topQuest.icon || '📌'}</span>
        <span className="quest-widget-title">{topQuest.title}</span>
      </div>
      <div className="quest-widget-progress-bar">
        <div
          className="quest-widget-progress-fill"
          style={{ width: `${topQuest.progress}%` }}
        />
      </div>
      <div className="quest-widget-progress-text">{topQuest.progress}%</div>
    </div>
  );
};
