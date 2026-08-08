// In-browser "hospital registry" — stands in for a real backend. Each newly
// registered hospital ("book") gets an admin login that, on success, is
// treated as role "doctor" so it lands on OP Desk, same as the built-in
// demo doctor account. Persisted to localStorage so it survives a refresh.

const STORAGE_KEY = "medix_hospitals";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(hospitals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hospitals));
}

export function getHospitals() {
  return readAll();
}

export function findHospitalByUsername(username) {
  return readAll().find(h => h.username.toLowerCase() === username.toLowerCase()) || null;
}

// Returns { ok: true, hospital } or { ok: false, error }.
export function registerHospital({ hospitalName, address, phone, adminName, username, password }) {
  const hospitals = readAll();
  if (!hospitalName?.trim() || !adminName?.trim() || !username?.trim() || !password) {
    return { ok: false, error: "All required fields must be filled in." };
  }
  if (findHospitalByUsername(username)) {
    return { ok: false, error: "That username is already taken — choose another." };
  }
  const hospital = {
    id: `HOSP-${Date.now()}`,
    hospitalName: hospitalName.trim(),
    address: address?.trim() || "",
    phone: phone?.trim() || "",
    adminName: adminName.trim(),
    username: username.trim(),
    password,
    createdAt: new Date().toISOString(),
  };
  writeAll([...hospitals, hospital]);
  return { ok: true, hospital };
}
