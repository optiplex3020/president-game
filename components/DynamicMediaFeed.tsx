import React, { useMemo } from 'react';
import { useMasterGame } from '../src/context/MasterGameContext';
import '../src/styles/DynamicMediaFeed.css';

export const DynamicMediaFeed: React.FC = () => {
  const { media } = useMasterGame();

  // Récupérer les articles récents (vraies données du MediaEngine)
  const recentArticles = useMemo(() => {
    return media.articles
      .slice(-12) // Derniers 12 articles
      .reverse(); // Plus récent en premier
  }, [media.articles]);

  const getSentimentColor = (sentiment: any) => {
    // sentiment peut être un nombre ou un objet avec towardsGovernment
    const sentimentValue = typeof sentiment === 'number'
      ? sentiment
      : sentiment?.towardsGovernment || 0;

    if (sentimentValue > 20) return 'positive';
    if (sentimentValue < -20) return 'negative';
    return 'neutral';
  };

  const getSentimentValue = (sentiment: any): number => {
    return typeof sentiment === 'number'
      ? sentiment
      : sentiment?.towardsGovernment || 0;
  };

  const getOutletInfo = (outletId: string) => {
    return media.outlets[outletId] || {
      name: 'Média inconnu',
      editorialLine: { bias: 'center' }
    };
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  if (recentArticles.length === 0) {
    return (
      <div className="dynamic-media-feed">
        <div className="media-feed-header">
          <h3>📰 Flux médiatique en temps réel</h3>
        </div>
        <div className="no-articles">
          <p>Aucun article publié pour le moment</p>
          <p className="hint">Les médias vont commencer à couvrir vos actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-media-feed">
      <div className="media-feed-header">
        <h3>📰 Flux médiatique en temps réel</h3>
        <div className="article-count">
          {recentArticles.length} article{recentArticles.length > 1 ? 's' : ''} récent{recentArticles.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="articles-stream">
        {recentArticles.map((article) => {
          const outlet = getOutletInfo(article.mediaOutletId);
          const sentimentClass = getSentimentColor(article.sentiment);
          const sentimentValue = getSentimentValue(article.sentiment);

          return (
            <article key={article.id} className={`article-card ${sentimentClass}`}>
              <div className="article-header">
                <div className="article-meta">
                  <span className="article-outlet">{outlet.name}</span>
                  <span className="article-time">{formatTime(article.date)}</span>
                </div>
                <div className={`article-sentiment ${sentimentClass}`}>
                  {sentimentValue > 20 && '📈'}
                  {sentimentValue < -20 && '📉'}
                  {sentimentValue >= -20 && sentimentValue <= 20 && '📊'}
                </div>
              </div>

              <h4 className="article-headline">{article.headline}</h4>

              <div className="article-content">
                {article.content.substring(0, 150)}...
              </div>

              <div className="article-footer">
                <div className="article-tags">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="article-tag">
                      #{tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
                <div className="article-stats">
                  <span className="article-reach" title="Portée estimée">
                    👁️ {Math.round((typeof article.reach === 'object' ? article.reach.views : article.reach || 0) / 1000)}k
                  </span>
                  <span className={`article-tone ${article.tone}`}>
                    {article.tone}
                  </span>
                </div>
              </div>

              <div className="article-actions">
                <button
                  className="btn-analyze"
                  onClick={() => {
                    const sentValue = getSentimentValue(article.sentiment);
                    const reachValue = typeof article.reach === 'object' ? article.reach.views : article.reach || 0;
                    alert(`Analyse de l'article "${article.headline}":\n\n` +
                          `Sentiment: ${sentValue > 0 ? 'Positif' : sentValue < 0 ? 'Négatif' : 'Neutre'} (${sentValue})\n` +
                          `Portée: ${Math.round(reachValue / 1000)}k lecteurs\n` +
                          `Tonalité: ${article.tone}\n\n` +
                          `Impact estimé sur l'opinion: ${sentValue > 0 ? '+' : ''}${Math.round(sentValue / 10)}%`);
                  }}
                >
                  📊 Analyser l'impact
                </button>
                <button
                  className="btn-respond"
                  onClick={() => {
                    alert(`Réponse officielle à "${article.headline}":\n\n` +
                          `Votre équipe de communication prépare une réponse officielle.\n` +
                          `Cela va mobiliser votre capital politique et attirer l'attention des médias.\n\n` +
                          `Êtes-vous sûr de vouloir répondre à cet article ?`);
                  }}
                >
                  💬 Répondre
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
