// Utility functions for generating minister data

export function generateBackground(): string[] {
  const possibleBackgrounds = [
    "Député",
    "Sénateur",
    "Maire",
    "Conseiller régional",
    "Haut fonctionnaire",
    "Chef d'entreprise",
    "Professeur d'université"
  ];
  
  // Sélectionner aléatoirement 1 à 3 backgrounds
  const numBackgrounds = 1 + Math.floor(Math.random() * 3);
  const selectedBackgrounds: string[] = [];
  
  for (let i = 0; i < numBackgrounds; i++) {
    const randomIndex = Math.floor(Math.random() * possibleBackgrounds.length);
    const background = possibleBackgrounds[randomIndex];
    if (!selectedBackgrounds.includes(background)) {
      selectedBackgrounds.push(background);
    }
  }
  
  return selectedBackgrounds;
}

export function generatePreferredRoles(): string[] {
  const allRoles = ['economie', 'interieur', 'justice', 'education', 'sante', 'environnement'];
  const numPreferred = 1 + Math.floor(Math.random() * 2);
  return allRoles
    .sort(() => Math.random() - 0.5)
    .slice(0, numPreferred);
}

export function generateSpecialEffects(): Record<string, number> {
  const possibleEffects = {
    popularity: Math.random() * 10,
    stability: Math.random() * 10,
    budget: Math.random() * 10
  };
  return possibleEffects;
}