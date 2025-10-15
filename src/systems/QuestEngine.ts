/**
 * QUEST ENGINE
 * Système de quêtes et objectifs dynamiques pour guider le joueur
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type QuestCategory =
  | 'main'          // Quêtes principales du mandat
  | 'legislative'   // Passer des lois
  | 'popularity'    // Gérer la popularité
  | 'economy'       // Objectifs économiques
  | 'parliament'    // Relations parlementaires
  | 'diplomacy'     // Relations internationales
  | 'crisis'        // Gestion de crises
  | 'reputation'    // Construire son héritage
  | 'tutorial'      // Quêtes du tutoriel
  | 'hidden';       // Quêtes secrètes

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  hidden?: boolean; // Objectif caché jusqu'à activation
}

export interface QuestReward {
  type: 'politicalCapital' | 'reputation' | 'achievement' | 'unlock' | 'bonus';
  value: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  status: QuestStatus;

  // Objectifs
  objectives: QuestObjective[];

  // Progression
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;

  // Contraintes
  timeLimit?: number; // Jours pour compléter
  daysRemaining?: number;
  prerequisites?: string[]; // IDs de quêtes requises
  unlocks?: string[]; // IDs de quêtes débloquées

  // Récompenses
  rewards: QuestReward[];

  // Conditions d'échec
  failConditions?: {
    type: 'time' | 'stat' | 'event';
    description: string;
    value?: number;
  }[];

  // Métadonnées
  priority?: number; // 1-10, pour trier
  hidden?: boolean; // Quête secrète
  repeatable?: boolean;
  icon?: string;
}

interface QuestEngineState {
  quests: Record<string, Quest>;
  activeQuestIds: string[];
  completedQuestIds: string[];
  failedQuestIds: string[];

  // Stats globales
  totalQuestsCompleted: number;
  totalRewardsEarned: number;
  currentStreak: number; // Quêtes complétées d'affilée

  // Actions
  initializeQuests: (questList: Quest[]) => void;
  activateQuest: (questId: string) => void;
  updateObjective: (questId: string, objectiveId: string, newValue: number) => void;
  completeQuest: (questId: string) => QuestReward[];
  failQuest: (questId: string, reason?: string) => void;
  abandonQuest: (questId: string) => void;

  // Helpers
  getAvailableQuests: () => Quest[];
  getActiveQuests: () => Quest[];
  getCompletedQuests: () => Quest[];
  getQuestsByCategory: (category: QuestCategory) => Quest[];
  checkQuestCompletion: (questId: string) => boolean;
  updateQuestProgress: (questId: string) => void;

  // Auto-unlock
  checkUnlockConditions: () => void;
  tickQuests: (days: number) => void; // Appelé chaque jour pour décompter timers
}

export const useQuestEngine = create<QuestEngineState>()(
  persist(
    (set, get) => ({
      quests: {},
      activeQuestIds: [],
      completedQuestIds: [],
      failedQuestIds: [],
      totalQuestsCompleted: 0,
      totalRewardsEarned: 0,
      currentStreak: 0,

      initializeQuests: (questList) => {
        const questsMap: Record<string, Quest> = {};

        questList.forEach(quest => {
          questsMap[quest.id] = {
            ...quest,
            status: quest.status || 'locked',
            progress: 0,
            objectives: quest.objectives.map(obj => ({
              ...obj,
              currentValue: 0,
              completed: false
            }))
          };
        });

        set({ quests: questsMap });

        // Auto-unlock quêtes sans prérequis
        get().checkUnlockConditions();
      },

      activateQuest: (questId) => {
        const quest = get().quests[questId];
        if (!quest || quest.status !== 'available') {
          console.warn(`Cannot activate quest ${questId} - not available`);
          return;
        }

        set(state => ({
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              status: 'active',
              startedAt: new Date()
            }
          },
          activeQuestIds: [...state.activeQuestIds, questId]
        }));

        console.log(`✅ Quest activated: ${quest.title}`);
      },

      updateObjective: (questId, objectiveId, newValue) => {
        const quest = get().quests[questId];
        if (!quest || quest.status !== 'active') return;

        const updatedObjectives = quest.objectives.map(obj => {
          if (obj.id === objectiveId) {
            const completed = newValue >= obj.targetValue;
            return {
              ...obj,
              currentValue: Math.min(newValue, obj.targetValue),
              completed
            };
          }
          return obj;
        });

        set(state => ({
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              objectives: updatedObjectives
            }
          }
        }));

        // Recalculer progression
        get().updateQuestProgress(questId);

        // Vérifier complétion
        if (get().checkQuestCompletion(questId)) {
          get().completeQuest(questId);
        }
      },

      completeQuest: (questId) => {
        const quest = get().quests[questId];
        if (!quest || quest.status === 'completed') return [];

        const now = new Date();

        set(state => ({
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              status: 'completed',
              progress: 100,
              completedAt: now
            }
          },
          activeQuestIds: state.activeQuestIds.filter(id => id !== questId),
          completedQuestIds: [...state.completedQuestIds, questId],
          totalQuestsCompleted: state.totalQuestsCompleted + 1,
          totalRewardsEarned: state.totalRewardsEarned + quest.rewards.length,
          currentStreak: state.currentStreak + 1
        }));

        console.log(`🎉 Quest completed: ${quest.title}`);

        // Débloquer quêtes suivantes
        if (quest.unlocks) {
          quest.unlocks.forEach(unlockedQuestId => {
            const unlockedQuest = get().quests[unlockedQuestId];
            if (unlockedQuest && unlockedQuest.status === 'locked') {
              set(state => ({
                quests: {
                  ...state.quests,
                  [unlockedQuestId]: {
                    ...unlockedQuest,
                    status: 'available'
                  }
                }
              }));
            }
          });
        }

        get().checkUnlockConditions();

        return quest.rewards;
      },

      failQuest: (questId, reason) => {
        const quest = get().quests[questId];
        if (!quest || quest.status === 'failed' || quest.status === 'completed') return;

        set(state => ({
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              status: 'failed',
              failedAt: new Date()
            }
          },
          activeQuestIds: state.activeQuestIds.filter(id => id !== questId),
          failedQuestIds: [...state.failedQuestIds, questId],
          currentStreak: 0 // Reset streak
        }));

        console.log(`❌ Quest failed: ${quest.title}${reason ? ` - ${reason}` : ''}`);
      },

      abandonQuest: (questId) => {
        const quest = get().quests[questId];
        if (!quest || quest.status !== 'active') return;

        set(state => ({
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              status: 'available',
              progress: 0,
              startedAt: undefined,
              objectives: quest.objectives.map(obj => ({
                ...obj,
                currentValue: 0,
                completed: false
              }))
            }
          },
          activeQuestIds: state.activeQuestIds.filter(id => id !== questId)
        }));

        console.log(`⏪ Quest abandoned: ${quest.title}`);
      },

      getAvailableQuests: () => {
        return Object.values(get().quests)
          .filter(q => q.status === 'available')
          .sort((a, b) => (b.priority || 0) - (a.priority || 0));
      },

      getActiveQuests: () => {
        return Object.values(get().quests)
          .filter(q => q.status === 'active')
          .sort((a, b) => (b.priority || 0) - (a.priority || 0));
      },

      getCompletedQuests: () => {
        return Object.values(get().quests)
          .filter(q => q.status === 'completed')
          .sort((a, b) => {
            const dateA = a.completedAt?.getTime() || 0;
            const dateB = b.completedAt?.getTime() || 0;
            return dateB - dateA;
          });
      },

      getQuestsByCategory: (category) => {
        return Object.values(get().quests)
          .filter(q => q.category === category)
          .sort((a, b) => (b.priority || 0) - (a.priority || 0));
      },

      checkQuestCompletion: (questId) => {
        const quest = get().quests[questId];
        if (!quest) return false;

        return quest.objectives.every(obj => obj.completed);
      },

      updateQuestProgress: (questId) => {
        const quest = get().quests[questId];
        if (!quest) return;

        const totalObjectives = quest.objectives.length;
        const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
        const progress = Math.round((completedObjectives / totalObjectives) * 100);

        set(state => ({
          quests: {
            ...state.quests,
            [questId]: {
              ...quest,
              progress
            }
          }
        }));
      },

      checkUnlockConditions: () => {
        const state = get();
        const { quests, completedQuestIds } = state;

        Object.entries(quests).forEach(([questId, quest]) => {
          if (quest.status !== 'locked') return;

          // Vérifier prérequis
          if (!quest.prerequisites || quest.prerequisites.length === 0) {
            // Pas de prérequis, débloquer immédiatement
            set(prevState => ({
              quests: {
                ...prevState.quests,
                [questId]: {
                  ...quest,
                  status: 'available'
                }
              }
            }));
          } else {
            // Vérifier que tous les prérequis sont complétés
            const allPrerequisitesCompleted = quest.prerequisites.every(prereqId =>
              completedQuestIds.includes(prereqId)
            );

            if (allPrerequisitesCompleted) {
              set(prevState => ({
                quests: {
                  ...prevState.quests,
                  [questId]: {
                    ...quest,
                    status: 'available'
                  }
                }
              }));
            }
          }
        });
      },

      tickQuests: (days) => {
        const state = get();

        Object.entries(state.quests).forEach(([questId, quest]) => {
          if (quest.status !== 'active' || !quest.timeLimit) return;

          const daysRemaining = (quest.daysRemaining ?? quest.timeLimit) - days;

          if (daysRemaining <= 0) {
            // Temps écoulé, échec de la quête
            get().failQuest(questId, 'Temps écoulé');
          } else {
            set(prevState => ({
              quests: {
                ...prevState.quests,
                [questId]: {
                  ...quest,
                  daysRemaining
                }
              }
            }));
          }
        });
      }
    }),
    {
      name: 'president-game-quests',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        quests: state.quests,
        activeQuestIds: state.activeQuestIds,
        completedQuestIds: state.completedQuestIds,
        failedQuestIds: state.failedQuestIds,
        totalQuestsCompleted: state.totalQuestsCompleted,
        totalRewardsEarned: state.totalRewardsEarned,
        currentStreak: state.currentStreak
      })
    }
  )
);
