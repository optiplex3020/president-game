export type Budget = {
  income: Record<string, number>;
  expenses: Record<string, number>;
  deficit: number;
  debt: number;
  gdpGrowth: number;
  inflation: number;
};