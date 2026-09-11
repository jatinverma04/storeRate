export default function StatCard({ label, value }) {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}
