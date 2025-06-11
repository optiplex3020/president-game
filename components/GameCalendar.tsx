
import React from 'react';
import { useCalendarStore } from '../src/store/calendarStore';
import '../src/styles/GameCalendar.css';

const generateDaysForMonth = (yearMonth: string): (string | null)[] => {
  const [year, month] = yearMonth.split('-').map(Number);
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  // Align Monday = 0
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const daysArray: (string | null)[] = Array.from({ length: startDayOfWeek }, () => null);
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(`${yearMonth}-${String(i).padStart(2, '0')}`);
  }
  // Pad to full weeks
  while (daysArray.length % 7 !== 0) {
    daysArray.push(null);
  }
  return daysArray;
};

const GameCalendar: React.FC = () => {
  const {
    currentDate,
    calendar,
    selectedDay,
    selectDay,
    goToNextEvent,
    advanceOneDay,
    addEvent
  } = useCalendarStore();

  const days = generateDaysForMonth(currentDate.slice(0, 7)); // "YYYY-MM"
  const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div>
          <h2 className="calendar-title">
            {new Date(currentDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="calendar-date">Date actuelle: {currentDate}</p>
        </div>
        <div className="calendar-buttons">
          <button onClick={advanceOneDay} className="btn-day">+1 jour</button>
          <button onClick={goToNextEvent} className="btn-event">
            <span>Prochain événement</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {weekdays.map((dayName) => (
          <div key={dayName} className="weekday">{dayName}</div>
        ))}

        {days.map((day, i) => {
          const isCurrent = day === currentDate;
          const hasEvent = !!(day && calendar[day]?.length);
          return (
            <div
              key={i}
              className={`calendar-day ${
                isCurrent ? 'current' : ''
              } ${hasEvent ? 'has-event' : ''}`}
              onClick={() => day && selectDay(day)}
              onDoubleClick={() => {
                if (!day) return;
                const title = prompt("Titre de l'événement à ajouter :", "");
                if (title) {
                  addEvent(day, { title, type: "social" });
                  selectDay(day);
                }
              }}
            >
              <span className="day-number">{day ? day.split("-")[2] : ''}</span>
              {day && calendar[day]?.length > 0 && (
                <div className="event-container">
                  <span className="event-icon">📌</span>
                  <span className="event-title">{calendar[day][0].title}</span>
                  {calendar[day].length > 1 && (
                    <span className="event-count">
                      +{calendar[day].length - 1} autres événements
                    </span>
                  )}
                </div>
              )}
              {hasEvent && <div className="event-marker" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameCalendar;