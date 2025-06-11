export interface Crisis {
  id: string;
  type: 'economic' | 'social' | 'environmental' | 'diplomatic' | 'security';
  title: string;
  description: string;
  severity: number;
  escalationRate: number;
  solutions: Array<CrisisSolution>;
}

export interface CrisisSolution {
  text: string;
  action: string;
  cost: number;
  effectiveness: number;
  effects: Record<string, number>;
}