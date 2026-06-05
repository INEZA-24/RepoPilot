export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
      <small style={{ color: "var(--muted)" }}>{label}</small>
      <strong style={{ display: "block", marginTop: 8, fontSize: 24 }}>{value}</strong>
    </div>
  );
}
