import React, { useMemo } from 'react';
import { useMasterGameEngine } from '../src/systems/MasterGameEngine';
import { useCalendarEngine } from '../src/systems/CalendarEngine';

interface EndOfDaySummaryProps {
  isOpen: boolean;
  onContinue: () => void;
}

export const EndOfDaySummary: React.FC<EndOfDaySummaryProps> = ({ isOpen, onContinue }) => {
  const { currentDate, getGlobalStats } = useMasterGameEngine();
  const { getEventsBetween } = useCalendarEngine();

  const stats = getGlobalStats();

  const eventsToday = useMemo(() => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return getEventsBetween(start, end);
  }, [currentDate, getEventsBetween]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="end-of-day-backdrop">
      <div className="end-of-day-modal">
        <header className="end-of-day-header">
          <h2>Bilan de la journée</h2>
        </header>

        <section className="summary-section">
          <h3>Couverture de la journée</h3>
          {eventsToday.length === 0 ? (
            <p>Aucun événement majeur enregistré aujourd&apos;hui.</p>
          ) : (
            <ul>
              {eventsToday.map(event => (
                <li key={event.id}>
                  <div className="event-title">{event.title}</div>
                  <div className="event-meta">
                    {event.category} —{' '}
                    {event.date.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {event.importance && <span className="event-tag">{event.importance}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="summary-section">
          <h3>Indicateurs clés</h3>
          <div className="summary-grid">
            <div>
              <strong>Popularité</strong>
              <p>{Math.round(stats.popularity)}%</p>
            </div>
            <div>
              <strong>Capital politique</strong>
              <p>{Math.round(stats.politicalCapital)}</p>
            </div>
            <div>
              <strong>Santé économique</strong>
              <p>{Math.round(stats.economicHealth)}</p>
            </div>
            <div>
              <strong>Stabilité sociale</strong>
              <p>{Math.round(stats.socialStability)}</p>
            </div>
            <div>
              <strong>Rayonnement international</strong>
              <p>{Math.round(stats.internationalStanding)}</p>
            </div>
          </div>
        </section>

        <footer className="end-of-day-footer">
          <button onClick={onContinue} className="primary">
            Passer au lendemain
          </button>
        </footer>
      </div>
    </div>
  );
};
