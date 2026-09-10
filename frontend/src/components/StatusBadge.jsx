const TONES = {
  // order statuses
  pending: "warn",
  processing: "neutral",
  shipped: "ok",
  delivered: "ok",
  cancelled: "danger",
  // payment
  paid: "ok",
  unpaid: "warn",
  refunded: "danger",
  // stock
  ok: "ok",
  low: "warn",
  out: "danger",
  // product status
  active: "ok",
  draft: "neutral",
  archived: "danger",
};

export default function StatusBadge({ value }) {
  const tone = TONES[value] || "neutral";
  return <span className={`badge badge-${tone}`}>{value}</span>;
}
