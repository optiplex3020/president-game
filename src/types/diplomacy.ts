export type DiplomaticAction = {
  type: 'visit' | 'treaty' | 'trade' | 'military';
  target: string;
  cost: number;
  timeToComplete: number;
  successChance: number;
  effects: Record<string, number>;
};