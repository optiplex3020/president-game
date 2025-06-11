export type Law = {
  id: string;
  title: string; 
  description: string;
  category: 'economic' | 'social' | 'environmental' | 'security' | 'fiscallity' | 'agriculture' | 'immigration' | 'health' | 'technology' | 'territoires' | 'education' | 'culture' | 'institution' | 'finance' | 'foreignAffairs';
  cost: number;
  timeToImplement: number;
  supportNeeded: number;
  effects: {
    immediate: Record<string, number>;
    longTerm: Record<string, number>;
  };
  oppositionLevel: number;
};