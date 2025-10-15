import React, { useMemo } from 'react';
import { useGameLoopEngine } from '../src/systems/GameLoopEngine';
import { useMasterGameEngine } from '../src/systems/MasterGameEngine';
import { useCalendarEngine } from '../src/systems/CalendarEngine';
import '../src/styles/ConsequenceTimeline.css';

export const ConsequenceTimeline: React.FC = () => {
  const { consequenceChains } = useGameLoopEngine();
  const { currentDate } = useMasterGameEngine();
  const { getEventsBetween } = useCalendarEngine();

  // Calculer les conséquences à venir dans les prochains 30 jours
  const upcomingConsequences = useMemo(() => {
    const now = currentDate.getTime();
    const thirtyDaysLater = new Date(currentDate);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const items: Array<{
      id: string;
      title: string;
      description: string;
      triggerDate: Date;
      daysUntil: number;
      type: 'consequence' | 'event';
      severity: number;
      category: string;
      originEventId?: string;
    }> = [];

    // Conséquences des chaînes
    consequenceChains.forEach(chain => {
      chain.consequences.forEach((consequence, index) => {
        if (consequence.triggered) return;

        const triggerDate = new Date(currentDate);
        triggerDate.setHours(triggerDate.getHours() + consequence.delay);

        if (triggerDate.getTime() <= thirtyDaysLater.getTime()) {
          const daysUntil = Math.ceil((triggerDate.getTime() - now) / (1000 * 60 * 60 * 24));

          items.push({
            id: `${chain.id}_${index}`,
            title: consequence.description,
            description: `Conséquence de: ${chain.originEventId}`,
            triggerDate,
            daysUntil: Math.max(0, daysUntil),
            type: 'consequence',
            severity: consequence.severity,
            category: consequence.type,
            originEventId: chain.originEventId
          });
        }
      });
    });

    // Événements programmés du calendrier
    const calendarEvents = getEventsBetween(currentDate, thirtyDaysLater);
    calendarEvents.forEach(event => {
      const daysUntil = Math.ceil((event.date.getTime() - now) / (1000 * 60 * 60 * 24));

      items.push({
        id: event.id,
        title: event.title,
        description: event.description || '',
        triggerDate: event.date,
        daysUntil: Math.max(0, daysUntil),
        type: 'event',
        severity: event.importance === 'critical' ? 90 : event.importance === 'high' ? 70 : event.importance === 'medium' ? 50 : 30,
        category: event.category
      });
    });

    // Trier par date
    return items.sort((a, b) => a.triggerDate.getTime() - b.triggerDate.getTime());
  }, [consequenceChains, currentDate, getEventsBetween]);

  // Grouper par période
  const groupedConsequences = useMemo(() => {
    const groups = {
      immediate: [] as typeof upcomingConsequences,
      soon: [] as typeof upcomingConsequences,
      upcoming: [] as typeof upcomingConsequences,
      later: [] as typeof upcomingConsequences
    };

    upcomingConsequences.forEach(item => {
      if (item.daysUntil === 0) {
        groups.immediate.push(item);
      } else if (item.daysUntil <= 3) {
        groups.soon.push(item);
      } else if (item.daysUntil <= 7) {
        groups.upcoming.push(item);
      } else {
        groups.later.push(item);
      }
    });

    return groups;
  }, [upcomingConsequences]);

  const getSeverityClass = (severity: number) => {
    if (severity >= 80) return 'severity-critical';
    if (severity >= 60) return 'severity-high';
    if (severity >= 40) return 'severity-medium';
    return 'severity-low';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      opinion: '👥',
      parliament: '⚖️',
      media: '📰',
      economy: '📊',
      international: '🌍',
      legislative: '📜',
      diplomatic: '🤝',
      crisis: '🚨',
      campaign: '📢',
      domestic: '🏛️',
      internal: '🔒'
    };
    return icons[category] || '📌';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderGroup = (title: string, items: typeof upcomingConsequences, badge?: string) => {
    if (items.length === 0) return null;

    return (
      <div className="timeline-group">
        <div className="timeline-group-header">
          <h4>{title}</h4>
          {badge && <span className="timeline-badge">{badge}</span>}
          <span className="timeline-count">{items.length}</span>
        </div>
        <div className="timeline-items">
          {items.map(item => (
            <div key={item.id} className={`timeline-item ${getSeverityClass(item.severity)}`}>
              <div className="timeline-item-icon">
                {getCategoryIcon(item.category)}
              </div>
              <div className="timeline-item-content">
                <div className="timeline-item-header">
                  <span className="timeline-item-title">{item.title}</span>
                  <span className="timeline-item-time">
                    {item.daysUntil === 0 ? "Aujourd'hui" : `J+${item.daysUntil}`}
                  </span>
                </div>
                {item.description && (
                  <div className="timeline-item-description">{item.description}</div>
                )}
                <div className="timeline-item-meta">
                  <span className="timeline-item-date">{formatDate(item.triggerDate)}</span>
                  <span className={`timeline-item-type ${item.type}`}>
                    {item.type === 'consequence' ? 'Conséquence' : 'Événement'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="consequence-timeline">
      <div className="timeline-header">
        <h3>À venir dans les 30 prochains jours</h3>
        <div className="timeline-summary">
          <span className="timeline-stat">
            <strong>{upcomingConsequences.length}</strong> éléments programmés
          </span>
          <span className="timeline-stat critical">
            <strong>
              {upcomingConsequences.filter(i => i.severity >= 80).length}
            </strong>{' '}
            critiques
          </span>
        </div>
      </div>

      {upcomingConsequences.length === 0 ? (
        <div className="timeline-empty">
          <div className="timeline-empty-icon">📅</div>
          <p>Aucune conséquence ou événement programmé dans les 30 prochains jours</p>
        </div>
      ) : (
        <div className="timeline-groups">
          {renderGroup("Immédiat", groupedConsequences.immediate, "🔴")}
          {renderGroup("Très prochainement (1-3j)", groupedConsequences.soon, "🟠")}
          {renderGroup("Cette semaine (4-7j)", groupedConsequences.upcoming, "🟡")}
          {renderGroup("Plus tard (8-30j)", groupedConsequences.later)}
        </div>
      )}
    </div>
  );
};

// Version compacte pour affichage dans un coin de l'écran
export const ConsequenceTimelineCompact: React.FC = () => {
  const { consequenceChains } = useGameLoopEngine();
  const { currentDate } = useMasterGameEngine();
  const { getEventsBetween } = useCalendarEngine();

  const nextThreeItems = useMemo(() => {
    const now = currentDate.getTime();
    const sevenDaysLater = new Date(currentDate);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const items: Array<{
      title: string;
      daysUntil: number;
      severity: number;
      category: string;
    }> = [];

    // Conséquences
    consequenceChains.forEach(chain => {
      chain.consequences.forEach(consequence => {
        if (consequence.triggered) return;

        const triggerDate = new Date(currentDate);
        triggerDate.setHours(triggerDate.getHours() + consequence.delay);

        if (triggerDate.getTime() <= sevenDaysLater.getTime()) {
          const daysUntil = Math.ceil((triggerDate.getTime() - now) / (1000 * 60 * 60 * 24));
          items.push({
            title: consequence.description,
            daysUntil: Math.max(0, daysUntil),
            severity: consequence.severity,
            category: consequence.type
          });
        }
      });
    });

    // Événements
    const calendarEvents = getEventsBetween(currentDate, sevenDaysLater);
    calendarEvents.forEach(event => {
      const daysUntil = Math.ceil((event.date.getTime() - now) / (1000 * 60 * 60 * 24));
      items.push({
        title: event.title,
        daysUntil: Math.max(0, daysUntil),
        severity: event.importance === 'critical' ? 90 : event.importance === 'high' ? 70 : 50,
        category: event.category
      });
    });

    return items
      .sort((a, b) => a.daysUntil - b.daysUntil || b.severity - a.severity)
      .slice(0, 3);
  }, [consequenceChains, currentDate, getEventsBetween]);

  if (nextThreeItems.length === 0) return null;

  return (
    <div className="consequence-timeline-compact">
      <div className="timeline-compact-header">
        <span>⏰</span>
        <span>À venir</span>
      </div>
      <div className="timeline-compact-list">
        {nextThreeItems.map((item, index) => (
          <div key={index} className="timeline-compact-item">
            <span className="timeline-compact-time">
              {item.daysUntil === 0 ? "Auj." : `J+${item.daysUntil}`}
            </span>
            <span className="timeline-compact-title">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
