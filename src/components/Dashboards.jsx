import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import { staffingEfficiency, kpiIndex, costToServe } from "../dashboardData";

function DeltaBadge({ delta }) {
  if (!delta) return null;
  return (
    <span className={`chart-delta ${delta.good ? "chart-delta-good" : "chart-delta-bad"}`}>
      {delta.value}
    </span>
  );
}

export default function Dashboards() {
  return (
    <section className="section" id="dashboards">
      <h2>Dashboard Examples</h2>
      <p className="section-note">
        Interactive examples built with representative sample data to demonstrate BI dashboard design
        (not real employer or client data).
      </p>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="chart-header">
            <div>
              <h3>{staffingEfficiency.title}</h3>
              <p className="chart-subtitle">{staffingEfficiency.subtitle}</p>
            </div>
            <DeltaBadge delta={staffingEfficiency.delta} />
          </div>
          <LineChart
            points={staffingEfficiency.points}
            color={staffingEfficiency.color}
            title={staffingEfficiency.title}
          />
        </div>

        <div className="dashboard-card">
          <div className="chart-header">
            <div>
              <h3>{kpiIndex.title}</h3>
              <p className="chart-subtitle">{kpiIndex.subtitle}</p>
            </div>
          </div>
          <BarChart bars={kpiIndex.bars} title={kpiIndex.title} maxValue={100} />
        </div>

        <div className="dashboard-card">
          <div className="chart-header">
            <div>
              <h3>{costToServe.title}</h3>
              <p className="chart-subtitle">{costToServe.subtitle}</p>
            </div>
            <DeltaBadge delta={costToServe.delta} />
          </div>
          <LineChart points={costToServe.points} color={costToServe.color} title={costToServe.title} />
        </div>
      </div>
    </section>
  );
}
