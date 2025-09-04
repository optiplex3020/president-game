export type Achievement = {
  id: string;
  title: string;
  description: string;
  condition: () => boolean;
  reward: Record<string, number>;
};