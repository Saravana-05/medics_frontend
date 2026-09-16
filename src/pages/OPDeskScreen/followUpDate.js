export function localDateValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function prescriptionDuration(drugs = []) {
  return Math.max(0, ...drugs.map(drug => {
    const days = Number(drug.days);
    return Number.isInteger(days) && days > 0 ? days : 0;
  }));
}

export function dateAfterDays(today, days) {
  const date = new Date(`${today}T12:00:00`);
  date.setDate(date.getDate() + Number(days));
  return localDateValue(date);
}

export function daysUntilDate(today, date) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}
