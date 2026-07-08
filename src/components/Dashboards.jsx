import { useMemo, useState } from "react";
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import StatTile from "./StatTile";
import { months, series, target, kpiBars } from "../dashboardData";
import { linearTrend } from "../utils/trend";

function pctDelta(first, last) {
  if (first === 0) return 0;
  return ((last - first) / Math.abs(first)) * 100;
}

function formatDelta(value, decimals = 0) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(decimals)}%`;
}

export default function Dashboards() {
  const [range, setRange] = useState(6);
  const startIdx = months.length - range;

  const mLabels = months.slice(startIdx);
  const calls = series.callsPerAgent.slice(startIdx);
  const cost = series.costIndex.slice(startIdx);
  const csat = series.csat.slice(startIdx);
  const resTime = series.resolutionTime.slice(startIdx);

  const callsTrend = useMemo(() => linearTrend(calls), [calls]);
  const targetLine = useMemo(() => mLabels.map(() => target.costIndex), [mLabels]);

  const callsDelta = pctDelta(calls[0], calls[calls.length - 1]);
  const costDelta = pctDelta(cost[0], cost[cost.length - 1]);
  const csatDelta = pctDelta(csat[0], csat[csat.length - 1]);
  const resDelta = pctDelta(resTime[0], resTime[resTime.length - 1]);

  const bars = kpiBars[range];

  return (
    <section className="section" id="dashboards">
      <div className="dashboard-toolbar">
        <div>
          <h2>Dashboard Examples</h2>
          <p className="section-note">
            Illustrative operations dashboard modeled on real BI reporting patterns (Power BI / Tableau style),
            built with representative sample data &mdash; not real employer or client data.
          </p>
        </div>
        <div className="range-toggle" role="group" aria-label="Date range">
          {[6, 12].map((r) => (
            <button
              key={r}
              type="button"
              className={`range-btn ${range === r ? "range-btn-active" : ""}`}
              onClick={() => setRange(r)}
            >
              Last {r} Mo
            </button>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <StatTile
          label="Calls Handled / Agent / Day"
          value={calls[calls.length - 1]}
          delta={{ text: formatDelta(callsDelta), good: callsDelta >= 0 }}
          values={calls}
        />
        <StatTile
          label="Cost-to-Serve Index"
          value={cost[cost.length - 1]}
          delta={{ text: formatDelta(costDelta), good: costDelta <= 0 }}
          values={cost}
        />
        <StatTile
          label="CSAT Score"
          value={csat[csat.length - 1]}
          delta={{ text: formatDelta(csatDelta), good: csatDelta >= 0 }}
          values={csat}
        />
        <StatTile
          label="Avg Resolution Time (hrs)"
          value={resTime[resTime.length - 1]}
          delta={{ text: formatDelta(resDelta, 1), good: resDelta <= 0 }}
          values={resTime}
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="chart-header">
            <div>
              <h3>Call Volume Trend</h3>
              <p className="chart-subtitle">Actual vs. linear trend &middot; calls per agent per day</p>
            </div>
          </div>
          <LineChart
            labels={mLabels}
            series={[
              { name: "Actual", color: "var(--accent)", values: calls, area: true },
              { name: "Trend", color: "var(--text-muted)", values: callsTrend, dashed: true },
            ]}
            title="Call Volume Trend"
          />
        </div>

        <div className="dashboard-card">
          <div className="chart-header">
            <div>
              <h3>KPI Performance Index</h3>
              <p className="chart-subtitle">0&ndash;100 scale, higher is better &middot; {range}-month average</p>
            </div>
          </div>
          <BarChart bars={bars} title="KPI Performance Index" maxValue={100} />
        </div>

        <div className="dashboard-card">
          <div className="chart-header">
            <div>
              <h3>Cost-to-Serve vs. Target</h3>
              <p className="chart-subtitle">Indexed to a fixed baseline &middot; lower is better</p>
            </div>
          </div>
          <LineChart
            labels={mLabels}
            series={[
              { name: "Actual", color: "var(--accent)", values: cost, area: true },
              { name: `Target (${target.costIndex})`, color: "var(--text-muted)", values: targetLine, dashed: true },
            ]}
            title="Cost-to-Serve vs Target"
          />
        </div>
      </div>
    </section>
  );
}
