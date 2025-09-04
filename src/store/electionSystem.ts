export type Campaign = {
  budget: number;
  strategies: Array<{
    type: string;
    cost: number;
    effectiveness: Record<string, number>;
  }>;
  regions: Record<string, {
    support: number;
    activities: string[];
  }>;
};