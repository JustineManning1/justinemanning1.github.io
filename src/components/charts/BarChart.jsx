import { useState } from "react";

const WIDTH = 480;
const HEIGHT = 220;
const PAD = { top: 26, right: 16, bottom: 30, left: 34 };
const BAR_MAX = 24;
const RADIUS = 4;

function roundedTopRectPath(x, y, w, h, r) {
  const radius = Math.min(r, h);
  return `M${x},${y + h} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h} Z`;
}

export default function BarChart({ bars, title, maxValue = 100 }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const slot = plotW / bars.length;
  const barWidth = Math.min(BAR_MAX, slot - 16);

  const yFor = (v) => PAD.top + plotH - (v / maxValue) * plotH;
  const tickCount = 4;
  const tickVals = Array.from({ length: tickCount + 1 }, (_, i) => (maxValue * i) / tickCount);

  const hovered = hoverIdx !== null ? bars[hoverIdx] : null;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="chart-svg" role="img" aria-label={title}>
        {tickVals.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(t)} y2={yFor(t)} className="chart-gridline" />
            <text x={PAD.left - 8} y={yFor(t)} className="chart-axis-label" textAnchor="end" dominantBaseline="middle">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {bars.map((b, i) => {
          const cx = PAD.left + slot * i + slot / 2;
          const barH = (b.value / maxValue) * plotH;
          const barY = PAD.top + plotH - barH;
          const isHover = hoverIdx === i;
          return (
            <g
              key={b.label}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              onFocus={() => setHoverIdx(i)}
              onBlur={() => setHoverIdx(null)}
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <rect x={cx - slot / 2} y={PAD.top} width={slot} height={plotH} fill="transparent" />
              <path
                d={roundedTopRectPath(cx - barWidth / 2, barY, barWidth, barH, RADIUS)}
                fill={b.color}
                opacity={isHover ? 1 : 0.9}
              />
              <text x={cx} y={barY - 8} className="chart-value-label" textAnchor="middle">
                {b.value}
              </text>
              <text x={cx} y={HEIGHT - 8} className="chart-axis-label" textAnchor="middle">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
      {hovered && (
        <div
          className="chart-tooltip"
          style={{
            left: `${((PAD.left + slot * hoverIdx + slot / 2) / WIDTH) * 100}%`,
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
