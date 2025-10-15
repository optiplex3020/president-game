import { useMasterGameEngine } from '../systems/MasterGameEngine';
import { useParliamentEngine } from '../systems/ParliamentEngine';
import { useOpinionEngine } from '../systems/OpinionEngine';

/**
 * Hook centralisé pour accéder à tous les moteurs de jeu
 */
export const useMasterGame = () => {
  const master = useMasterGameEngine();
  const parliament = useParliamentEngine();
  const opinion = useOpinionEngine();

  return {
    master,
    parliament,
    opinion
  };
};
