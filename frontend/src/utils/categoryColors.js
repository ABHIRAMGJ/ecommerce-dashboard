const PALETTE = {
  Kitchen: { bg: "#f1ded0", fg: "#9a4a24" },
  Outdoor: { bg: "#dbe8dc", fg: "#2f6b4f" },
  Lighting: { bg: "#f7e6bd", fg: "#8a5c10" },
  Storage: { bg: "#dde3ea", fg: "#3c5470" },
  Textiles: { bg: "#e9dced", fg: "#6a3d78" },
};
const FALLBACK = { bg: "#e7e0d4", fg: "#6b6255" };

export function categoryTint(category) {
  return PALETTE[category] || FALLBACK;
}

export function initials(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}
