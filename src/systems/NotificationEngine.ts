/**
 * NOTIFICATION ENGINE
 * Système de notifications toast pour feedback immédiat des actions
 */

import { create } from 'zustand';

export type NotificationType =
  | 'success'    // Action positive (loi adoptée, popularité +)
  | 'warning'    // Action neutre ou mitigée
  | 'danger'     // Action négative (crise, popularité -)
  | 'info'       // Information générale
  | 'economy'    // Indicateur économique
  | 'opinion'    // Changement d'opinion
  | 'parliament' // Action parlementaire
  | 'media'      // Couverture médiatique
  | 'diplomatic' // Événement international
  | 'achievement'; // Succès débloqué

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  duration?: number; // ms, défaut 5000
  timestamp: Date;
  read: boolean;
  metadata?: {
    impact?: {
      stat: string;
      value: number;
      trend: 'up' | 'down' | 'neutral';
    };
    category?: string;
    relatedEventId?: string;
  };
}

interface NotificationEngineState {
  // Notifications actives (toast à l'écran)
  activeNotifications: Notification[];

  // Historique complet (dernier 100)
  history: Notification[];

  // Statistiques
  totalNotifications: number;
  unreadCount: number;

  // Actions
  notify: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  notifySuccess: (title: string, message: string, metadata?: Notification['metadata']) => void;
  notifyWarning: (title: string, message: string, metadata?: Notification['metadata']) => void;
  notifyDanger: (title: string, message: string, metadata?: Notification['metadata']) => void;
  notifyInfo: (title: string, message: string, metadata?: Notification['metadata']) => void;

  // Notifications spécialisées
  notifyEconomicChange: (stat: string, value: number, message?: string) => void;
  notifyOpinionChange: (segment: string, value: number, message?: string) => void;
  notifyLawPassed: (lawTitle: string, votes: { pour: number; contre: number }) => void;
  notifyLawRejected: (lawTitle: string, votes: { pour: number; contre: number }) => void;
  notifyMediaArticle: (mediaName: string, headline: string, sentiment: number) => void;
  notifyAchievement: (achievementTitle: string, description: string) => void;

  // Gestion
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
  getUnreadNotifications: () => Notification[];
}

const generateId = () => `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const DEFAULT_DURATION = 5000; // 5 secondes

export const useNotificationEngine = create<NotificationEngineState>((set, get) => ({
  activeNotifications: [],
  history: [],
  totalNotifications: 0,
  unreadCount: 0,

  notify: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false,
      duration: notification.duration ?? DEFAULT_DURATION
    };

    set(state => ({
      activeNotifications: [...state.activeNotifications, newNotification],
      history: [newNotification, ...state.history].slice(0, 100), // Garder max 100
      totalNotifications: state.totalNotifications + 1,
      unreadCount: state.unreadCount + 1
    }));

    // Auto-dismiss après duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().dismissNotification(newNotification.id);
      }, newNotification.duration);
    }
  },

  notifySuccess: (title, message, metadata) => {
    get().notify({
      type: 'success',
      title,
      message,
      icon: '✅',
      metadata
    });
  },

  notifyWarning: (title, message, metadata) => {
    get().notify({
      type: 'warning',
      title,
      message,
      icon: '⚠️',
      metadata
    });
  },

  notifyDanger: (title, message, metadata) => {
    get().notify({
      type: 'danger',
      title,
      message,
      icon: '🚨',
      metadata
    });
  },

  notifyInfo: (title, message, metadata) => {
    get().notify({
      type: 'info',
      title,
      message,
      icon: 'ℹ️',
      metadata
    });
  },

  notifyEconomicChange: (stat, value, message) => {
    const trend = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
    const sign = value > 0 ? '+' : '';
    const icon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '📊';

    get().notify({
      type: 'economy',
      title: `${stat}`,
      message: message || `${sign}${value.toFixed(1)}%`,
      icon,
      metadata: {
        impact: { stat, value, trend },
        category: 'economy'
      }
    });
  },

  notifyOpinionChange: (segment, value, message) => {
    const trend = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
    const sign = value > 0 ? '+' : '';
    const icon = trend === 'up' ? '👍' : trend === 'down' ? '👎' : '👥';

    get().notify({
      type: 'opinion',
      title: `Opinion: ${segment}`,
      message: message || `${sign}${value} points`,
      icon,
      metadata: {
        impact: { stat: segment, value, trend },
        category: 'opinion'
      }
    });
  },

  notifyLawPassed: (lawTitle, votes) => {
    const total = votes.pour + votes.contre;
    const percentage = ((votes.pour / total) * 100).toFixed(1);

    get().notify({
      type: 'success',
      title: 'Loi adoptée !',
      message: `${lawTitle} - ${votes.pour}/${total} votes (${percentage}%)`,
      icon: '⚖️',
      duration: 7000,
      metadata: { category: 'parliament' }
    });
  },

  notifyLawRejected: (lawTitle, votes) => {
    const total = votes.pour + votes.contre;
    const percentage = ((votes.contre / total) * 100).toFixed(1);

    get().notify({
      type: 'danger',
      title: 'Loi rejetée',
      message: `${lawTitle} - ${votes.contre}/${total} contre (${percentage}%)`,
      icon: '❌',
      duration: 7000,
      metadata: { category: 'parliament' }
    });
  },

  notifyMediaArticle: (mediaName, headline, sentiment) => {
    const type = sentiment > 5 ? 'success' : sentiment < -5 ? 'danger' : 'info';
    const icon = sentiment > 5 ? '📰' : sentiment < -5 ? '📰💥' : '📰';

    get().notify({
      type,
      title: mediaName,
      message: headline,
      icon,
      duration: 6000,
      metadata: {
        category: 'media',
        impact: { stat: 'sentiment', value: sentiment, trend: sentiment > 0 ? 'up' : 'down' }
      }
    });
  },

  notifyAchievement: (achievementTitle, description) => {
    get().notify({
      type: 'achievement',
      title: `🏆 Succès débloqué !`,
      message: `${achievementTitle}: ${description}`,
      icon: '🎉',
      duration: 8000,
      metadata: { category: 'achievement' }
    });
  },

  dismissNotification: (id) => {
    set(state => ({
      activeNotifications: state.activeNotifications.filter(n => n.id !== id)
    }));
  },

  markAsRead: (id) => {
    set(state => {
      const notification = state.history.find(n => n.id === id);
      if (!notification || notification.read) return state;

      return {
        history: state.history.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    });
  },

  markAllAsRead: () => {
    set(state => ({
      history: state.history.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  },

  clearHistory: () => {
    set({
      history: [],
      unreadCount: 0
    });
  },

  getUnreadNotifications: () => {
    return get().history.filter(n => !n.read);
  }
}));
