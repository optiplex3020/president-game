const firstNames = [
  "Jean", "Pierre", "Michel", "André", "Philippe",
  "Marie", "Sophie", "Anne", "Claire", "Isabelle"
];

const lastNames = [
  "Dupont", "Martin", "Bernard", "Thomas", "Robert",
  "Richard", "Petit", "Durand", "Leroy", "Moreau"
];

export function randomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}