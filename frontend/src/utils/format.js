export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-LK", { year:"numeric", month:"short", day:"numeric" }).format(d);
}
export function formatMoney(value) {
  return new Intl.NumberFormat("en-LK", { style:"currency", currency:"LKR", maximumFractionDigits:0 }).format(Number(value || 0));
}
