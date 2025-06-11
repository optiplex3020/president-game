import React from 'react';
import { useMediaSystem } from '../src/store/mediaSystem';
import '../src/styles/MediaFeed.css';

export const MediaFeed: React.FC = () => {
  const { reactions, outlets } = useMediaSystem();
  
  const getMediaInfo = (mediaId: string) => 
    outlets.find(o => o.id === mediaId);

  const sortedReactions = [...reactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="media-feed">
      <h3 className="media-feed-title">
        <span className="media-icon">📰</span>
        Revue de Presse
      </h3>
      
      <div className="reactions-list">
        {sortedReactions.map(reaction => {
          const media = getMediaInfo(reaction.mediaId);
          return (
            <div 
              key={reaction.id} 
              className={`media-reaction ${reaction.sentiment > 0 ? 'positive' : 'negative'}`}
            >
              <div className="reaction-header">
                <span className="media-name">{media?.name}</span>
                <span className="media-type-icon">
                  {media?.type === 'tv' ? '📺' : media?.type === 'press' ? '📰' : '💻'}
                </span>
              </div>
              <p className="reaction-content">{reaction.content}</p>
              <div className="reaction-reach">
                <span className="reach-icon">👥</span>
                {reaction.reach.toLocaleString()} vues
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};