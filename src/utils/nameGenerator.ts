const firstNames = [
  // Hommes
  "Jean", "Pierre", "Michel", "André", "Philippe", "Alain", "Patrick", "Didier", 
  "François", "Daniel", "Gérard", "Bernard", "Christian", "Thierry", "Pascal",
  "Laurent", "Stéphane", "Olivier", "Nicolas", "Bruno", "Éric", "Sébastien",
  "Julien", "David", "Christophe", "Antoine", "Vincent", "Frédéric", "Jérôme",
  
  // Femmes  
  "Marie", "Sophie", "Anne", "Claire", "Isabelle", "Catherine", "Sylvie",
  "Martine", "Christine", "Brigitte", "Françoise", "Dominique", "Nathalie",
  "Sandrine", "Valérie", "Véronique", "Caroline", "Laurence", "Patricia",
  "Cécile", "Agnès", "Monique", "Florence", "Elisabeth", "Céline"
];

const lastNames = [
  "Dupont", "Martin", "Bernard", "Thomas", "Robert", "Richard", "Petit", 
  "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel",
  "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier", "Morel",
  "Girard", "André", "Mercier", "Blanc", "Guerin", "Boyer", "Rousseau",
  "Barbier", "Leroux", "Dubois", "Muller", "Lambert", "Bonnet", "François",
  "Fontaine", "Roussel", "Martinez", "Meyer", "Perez", "Dufour", "Blanchard"
];

export function randomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}