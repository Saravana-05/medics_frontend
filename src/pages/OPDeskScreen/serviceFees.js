// Demo rates only; replace with the billing catalog when real rates are available.
const SAMPLE_RATES = {
  "Nebulization": 300,
  "Wound Dressing": 400,
  "Suturing": 800,
  "Suture Removal": 250,
  "Physiotherapy Session": 500,
  "2D Echocardiography": 1500,
  "Doppler Study": 1200,
  "Vaccination": 600,
};

export function serviceFeeBreakdown(services = []) {
  const rows = services.map(item => {
    const name = item.name || item.title || "Service";
    const raw = item.amount ?? item.price;
    const supplied = raw !== undefined && raw !== null && raw !== "" ? Number(raw) : NaN;
    const sample = !Number.isFinite(supplied) || supplied < 0;
    const price = sample ? SAMPLE_RATES[name] ?? 500 : supplied;
    return { name, price, sample };
  });
  return { rows, total: rows.reduce((sum, row) => sum + Math.round(row.price * 100), 0) / 100 };
}
