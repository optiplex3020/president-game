import { create } from 'zustand';

export type MediaOutlet = {
  id: string;
  name: string;
  bias: number; // -100 (hostile) à 100 (favorable)
  influence: number; // 0-100
  type: 'tv' | 'press' | 'web';
};

export type MediaReaction = {
  id: string;
  mediaId: string;
  content: string;
  sentiment: number;
  timestamp: string;
  reach: number;
};

interface MediaState {
  outlets: MediaOutlet[];
  reactions: MediaReaction[];
  currentReach: number;
  addReaction: (reaction: Omit<MediaReaction, 'id' | 'timestamp'>) => void;
  updateMediaBias: (mediaId: string, biasChange: number) => void;
  generateReactions: (eventId: string, decision: number) => void;
}

export const useMediaSystem = create<MediaState>((set, get) => ({
  outlets: [
    {
      id: 'le-monde',
      name: 'Le Monde',
      bias: 0,
      influence: 80,
      type: 'press'
    },
    {
      id: 'tf1',
      name: 'TF1',
      bias: 20,
      influence: 90,
      type: 'tv'
    },
    // ... autres médias
  ],
  reactions: [],
  currentReach: 0,

  addReaction: (reaction) => {
    set((state) => ({
      reactions: [...state.reactions, {
        ...reaction,
        id: Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString()
      }]
    }));
  },

  updateMediaBias: (mediaId, biasChange) => {
    set((state) => ({
      outlets: state.outlets.map(outlet => 
        outlet.id === mediaId 
          ? { ...outlet, bias: Math.max(-100, Math.min(100, outlet.bias + biasChange)) }
          : outlet
      )
    }));
  },

  generateReactions: (eventId, decision) => {
    const outlets = get().outlets;
    outlets.forEach(outlet => {
      if (Math.random() < outlet.influence / 100) {
        // Générer une réaction basée sur le biais du média
        get().addReaction({
          mediaId: outlet.id,
          content: `Réaction générée pour ${eventId}`,
          sentiment: outlet.bias,
          reach: Math.floor(Math.random() * outlet.influence)
        });
      }
    });
  }
}));