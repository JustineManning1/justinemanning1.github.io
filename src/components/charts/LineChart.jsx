import { useState } from "react";

const WIDTH = 480;
const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 26, left: 34 };

export default function LineChart({ points, color = "var(--accent)", title }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const values = points.map((d) => d.value);
  const maxV = Math.max(...values);
  const minV = Math.min(0, Math.min(...values));
  const range = maxV - minV || 1;

  const xFor = (i) => PAD.left + (i / (points.length - 1)) * plotW;
  const yFor = (v) => PAD.top + plotH - ((v - minV) / range) * plotH;

  const linePoints = points.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");
  const areaPoints = `${xFor(0)},${PAD.top + plotH} ${linePoints} ${xFor(points.length - 1)},${PAD.top + plotH}`;

  const tickCount = 4;
  const tickVals = Array.from({ length: tickCount + 1 }, (_, i) => minV + (range * i) / tickCount);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const idx = Math.round(((relX - PAD.left) / plotW) * (points.length - 1));
    setHoverIdx(Math.min(Math.max(idx, 0), points.length - 1));
  }

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div className="chart-wrap">
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
        <polygon points={areaPoints} fill={color} opacity="0.1" stroke="none" />
        <polyline points={linePoints} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((d, i) => (
          <text key={d.label} x={xFor(i)} y={HEIGHT - 6} className="chart-axis-label" textAnchor="middle">
            {d.label}
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
            <circle
              cx={xFor(hoverIdx)}
              cy={yFor(points[hoverIdx].value)}
              r="5"
              fill={color}
              stroke="var(--bg-alt)"
              strokeWidth="2"
            />
          </>
        )}
        <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="transparent" />
      </svg>
      {hovered && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(xFor(hoverIdx) / WIDTH) * 100}%`,
            top: `${(yFor(hovered.value) / HEIGHT) * 100}%`,
          }}
        >
          <strong>{hovered.value}</strong>
          <span>{hovered.label}</span>
        </div>
      )}
    </div>
  );
}
