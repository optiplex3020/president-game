// @ts-nocheck
import React, { useMemo } from 'react';
import type { PartyId } from '../src/types/parliament';
import { useMasterGame } from '../src/context/MasterGameContext';
import '../src/styles/PartyCompositionWidget.css';

interface PartyCompositionWidgetProps {
  selectedPartyId: PartyId | null;
}

export const PartyCompositionWidget: React.FC<PartyCompositionWidgetProps> = ({ selectedPartyId }) => {
  const { parliament } = useMasterGame();

  const distribution = useMemo(() => {
    const groups = parliament?.parliamentaryGroups ?? {};
    return Object.values(groups)
      .map(group => ({
        id: group.id,
        name: group.name.toUpperCase(),
        seats: group.seats,
        share: Math.round((group.seats / 577) * 1000) / 10
      }))
      .sort((a, b) => b.seats - a.seats);
  }, [parliament?.parliamentaryGroups]);

  const totalSeats = distribution.reduce((sum, group) => sum + group.seats, 0);
  const majorityThreshold = 289;

  return (
    <div className="party-composition-widget">
      <div className="widget-header">
        <h3>Composition de l'Assemblée Nationale</h3>
        <span className="total-seats">{totalSeats} / 577 sièges</span>
      </div>

      <div className="majority-bar">
        <div className="majority-threshold" style={{ left: `${(majorityThreshold / 577) * 100}%` }}>
          Majorité absolue (289)
        </div>
      </div>

      <ul className="party-list">
        {distribution.map(group => {
          const isSelected = selectedPartyId === group.id;
          return (
            <li key={group.id} className={`party-item ${isSelected ? 'selected' : ''}`}>
              <div className="party-info">
                <span className="party-name">{group.name}</span>
                {isSelected && <span className="party-tag">Votre parti</span>}
              </div>
              <div className="party-gauge">
                <div
                  className={`party-gauge-fill ${group.id}`}
                  style={{ width: `${(group.seats / 577) * 100}%` }}
                />
              </div>
              <div className="party-metrics">
                <span className="party-seats">{group.seats} sièges</span>
                <span className="party-share">{group.share}%</span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="majority-note">
        Objectif : 289 sièges pour une majorité absolue. La majorité relative impose de négocier texte par texte.
      </p>
    </div>
  );
};

