import React from 'react';
import { useGameState } from '../src/store/gameState';
import '../src/styles/SocialFeed.css';

const SocialFeed: React.FC = () => {
  const { socialFeed } = useGameState();

  const getRelativeTime = (index: number, feedLength: number) => {
    const minutes = (feedLength - 1 - index) * 5;
    if (minutes === 0) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (minutes < 1440) return `Il y a ${Math.floor(minutes / 60)}h`;
    return `Il y a ${Math.floor(minutes / 1440)}j`;
  };

  return (
    <div className="social-feed">
      <div className="social-feed-header">
        <h2 className="social-feed-title">
          <span className="social-feed-icon">📱</span>
          Actualités & Réactions
        </h2>
      </div>

      <div className="social-feed-content">
        {socialFeed.length === 0 ? (
          <div className="social-feed-empty">
            <p className="empty-title">Pas encore d'actualités</p>
            <p className="empty-subtitle">Les réactions apparaîtront ici au fil de vos décisions</p>
          </div>
        ) : (
          socialFeed.map((message, index) => (
            <div key={index} className="social-feed-item">
              <div className="feed-item-content">
                <div className="feed-item-icon">
                  {getMessageIcon(message)}
                </div>
                <div className="feed-item-main">
                  <p className="feed-item-message">{message}</p>
                  <div className="feed-item-metadata">
                    <span>{getRelativeTime(index, socialFeed.length)}</span>
                    <span className="metadata-separator">•</span>
                    <span>{getMessageSource(message)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const getMessageIcon = (message: string) => {
  if (message.includes('Décision')) return '⚡️';
  if (message.includes('Réaction')) return '💭';
  if (message.includes('Crise')) return '🚨';
  return '📰';
};

const getMessageSource = (message: string) => {
  if (message.includes('économie')) return 'Les Échos';
  if (message.includes('social')) return 'Le Monde';
  if (message.includes('international')) return 'Le Figaro';
  if (message.includes('politique')) return 'Libération';
  return 'AFP';
};

export default SocialFeed;