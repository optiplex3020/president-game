import React, { useState } from 'react';
import { useCabinetStore } from '../src/store/cabinetStore';
import type { Minister, MinisterMission } from '../src/types/cabinet';
import '../src/styles/CouncilScreen.css';
import { MissionAssignmentModal } from './modals/MissionAssignment';
import { MinisterReplacementModal } from './modals/MinisterReplacement';
const CouncilScreen: React.FC = () => {
  const { ministers, missions, assignMission, replaceMinister } = useCabinetStore();
  const [selectedMinister, setSelectedMinister] = useState<string | null>(null);
  const [showMissionModal, setShowMissionModal] = useState(false);

  const handleAssignMission = (ministerId: string, missionId: string) => {
    assignMission(ministerId, missionId);
    setShowMissionModal(false);
  };

  return (
    <div className="council-screen">
      <div className="council-header">
        <h2>Conseil des Ministres</h2>
      </div>

      <div className="minister-grid">
        {Object.entries(ministers).map(([roleId, minister]) => (
          <div key={roleId} className="minister-card">
            <div className="minister-header">
              <h3>{minister.name}</h3>
              <span className="minister-role">{minister.roles.join(', ')}</span>
            </div>

            <div className="minister-stats">
              <StatBar label="Loyauté" value={minister.loyalty} />
              <StatBar label="Compétence" value={minister.competence} />
              <StatBar label="Popularité" value={minister.popularity} />
            </div>

            {minister.missions && minister.missions.length > 0 && (
              <div className="minister-missions">
                <h4>Missions en cours</h4>
                {minister.missions.map(mission => (
                  <div key={mission.id} className="mission-progress">
                    <span>{mission.title}</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{width: `${mission.progress}%`}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="minister-actions">
              <button 
                className="btn-replace"
                onClick={() => setSelectedMinister(roleId)}
              >
                Remplacer
              </button>
              <button 
                className="btn-assign"
                onClick={() => {
                  setSelectedMinister(roleId);
                  setShowMissionModal(true);
                }}
              >
                Assigner une mission
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMinister && showMissionModal && (
        <MissionAssignmentModal
          ministerId={selectedMinister}
          onClose={() => {
            setSelectedMinister(null);
            setShowMissionModal(false);
          }}
        />
      )}

      {selectedMinister && !showMissionModal && (
        <MinisterReplacementModal
          roleId={selectedMinister}
          onClose={() => setSelectedMinister(null)}
        />
      )}
    </div>
  );
};

const StatBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="stat">
    <span className="stat-label">{label}</span>
    <div className="stat-bar">
      <div 
        className="stat-fill"
        style={{width: `${value}%`}}
      />
    </div>
  </div>
);

export default CouncilScreen;