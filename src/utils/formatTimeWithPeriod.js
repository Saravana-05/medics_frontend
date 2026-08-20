export function formatTimeWithPeriod(value) {
  const time = String(value || "").trim();
  if (!time) return "";

  const existingPeriod = time.match(/\s*(am|pm)$/i);
  if (existingPeriod) {
    return `${time.slice(0, existingPeriod.index).trim()} ${existingPeriod[1].toUpperCase()}`;
  }

  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time;

  const hour = Number(match[1]);
  if (hour > 23) return time;

  const displayHour = hour % 12 || 12;
  return `${displayHour}:${match[2]} ${hour >= 12 ? "PM" : "AM"}`;
}
