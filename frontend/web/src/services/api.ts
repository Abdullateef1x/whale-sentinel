const API_BASE = "http://localhost:5000/api";

export const fetchSignals = async () => {
  const res = await fetch(`${API_BASE}/signals`);
  if (!res.ok) {
    throw new Error("Failed to fetch signals");
  }
  return res.json();
};