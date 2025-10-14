// @ts-nocheck
import React, { useMemo } from 'react';
import { useMasterGame } from '../src/context/MasterGameContext';
import '../src/styles/OpinionPreview.css';

export const OpinionPreview: React.FC = () => {
  const { opinion } = useMasterGame();

  const segments = useMemo(() => Object.values(opinion?.demographics ?? {}), [opinion?.demographics]);
  const sortedByTrust = useMemo(
    () => [...segments].sort((a, b) => b.opinion.trustInPresident - a.opinion.trustInPresident),
    [segments]
  );

  const topSupporters = sortedByTrust.slice(0, 3);
  const criticalSegments = sortedByTrust.slice(-3).reverse();

  const publicMood = opinion?.publicMood;

  return (
    <div className="opinion-preview">
      <div className="opinion-header">
        <h3>Opinion publique initiale</h3>
        {publicMood && (
          <span className={`public-mood ${publicMood.generalMood}`}>
            Humeur générale : {publicMood.generalMood} ({publicMood.moodScore > 0 ? '+' : ''}{publicMood.moodScore})
          </span>
        )}
      </div>

      <div className="opinion-sections">
        <div className="opinion-column">
          <h4>Segments favorables</h4>
          <ul>
            {topSupporters.map(segment => (
              <li key={segment.id}>
                <div className="segment-name">{segment.name}</div>
                <div className="segment-metric positive">
                  {segment.opinion.trustInPresident.toFixed(1)}% de confiance
                </div>
                <div className="segment-context">
                  Influence : {segment.characteristics.influenceability} · Engagement : {segment.characteristics.politicalEngagement}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="opinion-column">
          <h4>Segments critiques</h4>
          <ul>
            {criticalSegments.map(segment => (
              <li key={segment.id}>
                <div className="segment-name">{segment.name}</div>
                <div className="segment-metric negative">
                  {segment.opinion.trustInPresident.toFixed(1)}% de confiance
                </div>
                <div className="segment-context">
                  Tension : {100 - segment.opinion.trustInPresident.toFixed(0)} · Mobilisation potentielle <span>{segment.characteristics.influenceability}%</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {publicMood && (
        <div className="mood-topics">
          <h4>Sujets dominants</h4>
          <ul>
            {publicMood.dominantTopics.slice(0, 3).map(topic => (
              <li key={topic.topic}>
                <span className="topic-name">{topic.topic.replace('_', ' ')}</span>
                <span className={`topic-sentiment ${topic.sentiment >= 0 ? 'positive' : 'negative'}`}>
                  {topic.sentiment >= 0 ? '+' : ''}
                  {topic.sentiment}
                </span>
                <span className="topic-volume">{topic.discussionVolume}% de volume</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

