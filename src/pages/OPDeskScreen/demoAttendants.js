// Named contacts for the demo patient register only.
const CONTACTS = [
  ["Lakshmi", "Wife"], ["Aravind", "Husband"],
  ["Meenakshi", "Mother"], ["Raman", "Father"],
  ["Suresh", "Brother"], ["Revathi", "Sister"],
  ["Karthik", "Son"], ["Priya", "Daughter"],
  ["Ganesh", "Guardian"], ["Kavitha", "Wife"],
];

export function demoAttendant(patient, index) {
  if (patient.attendant?.name && patient.attendant.name !== "Family Attendant") return patient.attendant;
  const [name, relationship] = CONTACTS[index % CONTACTS.length];
  return { name, relationship, phone: `91000${String(index + 1).padStart(5, "0")}` };
}
