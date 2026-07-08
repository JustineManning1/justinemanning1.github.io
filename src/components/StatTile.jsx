function Sparkline({ values }) {
  const w = 88;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xFor = (i) => (i / (values.length - 1)) * w;
  const yFor = (v) => h - ((v - min) / range) * h;
  const linePoints = values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={linePoints}
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={xFor(values.length - 1)}
        cy={yFor(values[values.length - 1])}
        r="2.5"
        fill="var(--accent)"
      />
    </svg>
  );
}

export default function StatTile({ label, value, unit = "", delta, values }) {
  return (
    <div className="stat-tile">
      <p className="stat-label">{label}</p>
      <div className="stat-value-row">
        <span className="stat-value">
          {value}
          {unit}
        </span>
        {delta && (
          <span className={`chart-delta ${delta.good ? "chart-delta-good" : "chart-delta-bad"}`}>
            {delta.text}
          </span>
        )}
      </div>
      {values && <Sparkline values={values} />}
    </div>
  );
}
