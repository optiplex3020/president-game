import React, { useMemo } from 'react';
import { useMasterGameEngine } from '../src/systems/MasterGameEngine';
import { useCalendarEngine } from '../src/systems/CalendarEngine';
import { useMilestoneEngine } from '../src/systems/MilestoneEngine';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({ isOpen, onClose }) => {
  const { currentDate, dayInMandate } = useMasterGameEngine();
  const { getEventsBetween } = useCalendarEngine();
  const { getUpcomingMilestones } = useMilestoneEngine();

  const todayEvents = useMemo(() => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return getEventsBetween(start, end);
  }, [getEventsBetween, currentDate]);

  const upcomingMilestones = useMemo(() => {
    return getUpcomingMilestones(currentDate, 3);
  }, [getUpcomingMilestones, currentDate]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="daily-briefing-backdrop">
      <div className="daily-briefing-modal">
        <header className="daily-briefing-header">
          <h2>Briefing quotidien</h2>
          <button onClick={onClose} className="close-button" aria-label="Fermer le briefing">
            ×
          </button>
        </header>

        <section className="briefing-meta">
          <div>
            <strong>Date :</strong>{' '}
            {currentDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div>
            <strong>Jour de mandat :</strong> {dayInMandate}
          </div>
        </section>

        <section className="briefing-section">
          <h3>Agenda du jour</h3>
          {todayEvents.length === 0 ? (
            <p>Aucun événement inscrit à l&apos;agenda pour aujourd&apos;hui.</p>
          ) : (
            <ul>
              {todayEvents.map(event => (
                <li key={event.id}>
                  <div className="event-title">{event.title}</div>
                  <div className="event-time">
                    {event.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {event.description && <p className="event-description">{event.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="briefing-section">
          <h3>À surveiller</h3>
          {upcomingMilestones.length === 0 ? (
            <p>Aucun jalon majeur dans les prochains jours.</p>
          ) : (
            <ul>
              {upcomingMilestones.map(milestone => (
                <li key={milestone.id}>
                  <div className="milestone-title">{milestone.title}</div>
                  <div className="milestone-date">
                    {milestone.date.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {milestone.description && (
                    <p className="milestone-description">{milestone.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="briefing-footer">
          <button onClick={onClose} className="primary">
            Commencer la journée
          </button>
        </footer>
      </div>
    </div>
  );
};
