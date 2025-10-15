import React, { useEffect } from 'react';
import { useNotificationEngine, type Notification } from '../src/systems/NotificationEngine';
import '../src/styles/NotificationToast.css';

export const NotificationToast: React.FC = () => {
  const { activeNotifications, dismissNotification } = useNotificationEngine();

  return (
    <div className="notification-container">
      {activeNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onDismiss: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const { markAsRead } = useNotificationEngine();

  useEffect(() => {
    // Marquer comme lu après 1 seconde
    const timer = setTimeout(() => {
      markAsRead(notification.id);
    }, 1000);

    return () => clearTimeout(timer);
  }, [notification.id, markAsRead]);

  const getNotificationClass = () => {
    const baseClass = 'notification-toast';
    const typeClass = `notification-${notification.type}`;
    return `${baseClass} ${typeClass} notification-enter`;
  };

  const getTrendIcon = () => {
    if (!notification.metadata?.impact) return null;

    const { trend, value } = notification.metadata.impact;
    if (trend === 'up') return <span className="trend-icon trend-up">▲ +{Math.abs(value).toFixed(1)}</span>;
    if (trend === 'down') return <span className="trend-icon trend-down">▼ {value.toFixed(1)}</span>;
    return null;
  };

  return (
    <div className={getNotificationClass()} onClick={onDismiss}>
      <div className="notification-icon">
        {notification.icon || '📢'}
      </div>

      <div className="notification-content">
        <div className="notification-title">
          {notification.title}
          {getTrendIcon()}
        </div>
        <div className="notification-message">{notification.message}</div>
      </div>

      <button className="notification-close" onClick={onDismiss} aria-label="Fermer">
        ×
      </button>
    </div>
  );
};

// Composant secondaire: Historique des notifications dans un panneau
export const NotificationHistory: React.FC = () => {
  const { history, unreadCount, markAsRead, markAllAsRead, clearHistory } = useNotificationEngine();

  return (
    <div className="notification-history">
      <div className="notification-history-header">
        <h3>
          Notifications
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </h3>
        <div className="notification-history-actions">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-small">
              Tout marquer comme lu
            </button>
          )}
          <button onClick={clearHistory} className="btn-small">
            Effacer l'historique
          </button>
        </div>
      </div>

      <div className="notification-history-list">
        {history.length === 0 ? (
          <div className="notification-empty">Aucune notification</div>
        ) : (
          history.map((notification) => (
            <div
              key={notification.id}
              className={`notification-history-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-history-icon">{notification.icon || '📢'}</div>
              <div className="notification-history-content">
                <div className="notification-history-title">{notification.title}</div>
                <div className="notification-history-message">{notification.message}</div>
                <div className="notification-history-time">
                  {notification.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              {!notification.read && <div className="notification-unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
