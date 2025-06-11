import React from 'react';
import type { PropsWithChildren } from 'react';
import GameCalendar from './GameCalendar';
import EventCard from './EventCard';
import StatsPanel from './StatsPanel';
import CalendarSidebar from './CalendarSidebar';
import SocialFeed from './SocialFeed';
import ProfileTab from './ProfileTab';

const GameLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header avec le profil du président */}
        <div className="mb-8">
          <ProfileTab />
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-12 gap-6">
          {/* Colonne de gauche : Calendrier et événements */}
          <div className="col-span-8 space-y-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <GameCalendar />
                {children}
              </div>
              <div className="w-80">
                <CalendarSidebar />
              </div>
            </div>
            <EventCard />
          </div>

          {/* Colonne de droite : Stats et fil d'actualité */}
          <div className="col-span-4 space-y-6">
            <StatsPanel />
            <SocialFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLayout;