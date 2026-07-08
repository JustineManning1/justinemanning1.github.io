import { useState } from "react";

const WIDTH = 480;
const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 26, left: 34 };

function formatValue(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

export default function LineChart({ labels, series, title }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const allValues = series.flatMap((s) => s.values);
  const maxV = Math.max(...allValues);
  const minV = Math.min(0, Math.min(...allValues));
  const range = maxV - minV || 1;

  const xFor = (i) => PAD.left + (i / (labels.length - 1)) * plotW;
  const yFor = (v) => PAD.top + plotH - ((v - minV) / range) * plotH;

  const tickCount = 4;
  const tickVals = Array.from({ length: tickCount + 1 }, (_, i) => minV + (range * i) / tickCount);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const idx = Math.round(((relX - PAD.left) / plotW) * (labels.length - 1));
    setHoverIdx(Math.min(Math.max(idx, 0), labels.length - 1));
  }

  const tooltipY =
    hoverIdx !== null ? Math.min(...series.map((s) => yFor(s.values[hoverIdx]))) : null;

  return (
    <div className="chart-wrap">
      {series.length > 1 && (
        <div className="chart-legend">
          {series.map((s) => (
            <span className="chart-legend-item" key={s.name}>
              <span
                className="chart-legend-swatch"
                style={{
                  backgroundColor: s.dashed ? "transparent" : s.color,
                  borderColor: s.color,
                  borderStyle: s.dashed ? "dashed" : "solid",
                }}
              />
              {s.name}
            </span>
          ))}
        </div>
      )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="chart-svg"
        role="img"
        aria-label={title}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {tickVals.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(t)} y2={yFor(t)} className="chart-gridline" />
            <text x={PAD.left - 8} y={yFor(t)} className="chart-axis-label" textAnchor="end" dominantBaseline="middle">
              {Math.round(t)}
            </text>
          </g>
        ))}

        {series.map((s) => {
          const linePoints = s.values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
          const areaPoints = s.area
            ? `${xFor(0)},${PAD.top + plotH} ${linePoints} ${xFor(s.values.length - 1)},${PAD.top + plotH}`
            : null;
          return (
            <g key={s.name}>
              {areaPoints && <polygon points={areaPoints} fill={s.color} opacity="0.1" stroke="none" />}
              <polyline
                points={linePoints}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={s.dashed ? "6 4" : undefined}
              />
            </g>
          );
        })}

        {labels.map((label, i) => (
          <text key={label} x={xFor(i)} y={HEIGHT - 6} className="chart-axis-label" textAnchor="middle">
            {label}
          </text>
        ))}

        {hoverIdx !== null && (
          <>
            <line
              x1={xFor(hoverIdx)}
              x2={xFor(hoverIdx)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              className="chart-crosshair"
            />
            {series.map((s) => (
              <circle
                key={s.name}
                cx={xFor(hoverIdx)}
                cy={yFor(s.values[hoverIdx])}
                r="5"
                fill={s.color}
                stroke="var(--bg-alt)"
                strokeWidth="2"
              />
            ))}
          </>
        )}

        <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="transparent" />
      </svg>

      {hoverIdx !== null && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(xFor(hoverIdx) / WIDTH) * 100}%`,
            top: `${(tooltipY / HEIGHT) * 100}%`,
          }}
        >
          <span className="chart-tooltip-label">{labels[hoverIdx]}</span>
          {series.map((s) => (
            <div className="chart-tooltip-row" key={s.name}>
              <span className="chart-tooltip-key" style={{ backgroundColor: s.color }} />
              <strong>{formatValue(s.values[hoverIdx])}</strong>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
