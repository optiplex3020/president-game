export type PoliticalParty = {
  id: string;
  name: string;
  ideology: {
    liberal: number;
    autoritaire: number;
    ecolo: number;
    social: number;
    souverainiste: number;
  };
  // Ajoutez d'autres propriétés nécessaires
};