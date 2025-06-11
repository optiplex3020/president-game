import { useCalendarStore } from '../src/store/calendarStore';
import React from 'react';

const CalendarSidebar = () => {
  const { selectedDay, calendar } = useCalendarStore();

  if (!selectedDay) return (
    <div className="p-4 text-gray-600">Sélectionnez un jour dans le calendrier</div>
  );

  const events = calendar[selectedDay] || [];

  return (
    <div className="p-4 border-l w-full max-w-md bg-white shadow-md rounded-md">
      <h3 className="font-bold text-lg mb-2">
        Détail du {selectedDay}
      </h3>
      {events.length === 0 ? (
        <p>Aucun événement prévu ce jour-là.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((evt, idx) => (
            <li key={idx} className="p-2 border rounded bg-gray-50">
              <span className="font-medium">{evt.title}</span> — <i>{evt.type}</i>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarSidebar;