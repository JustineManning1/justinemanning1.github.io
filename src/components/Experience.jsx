import { experience } from "../data";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <h2>Professional Experience</h2>
      <div className="timeline">
        {experience.map((job) => (
          <article className="timeline-item" key={job.company}>
            <div className="timeline-header">
              <div>
                <h3>{job.role}</h3>
                <p className="timeline-org">{job.company}</p>
              </div>
              <div className="timeline-dates-col">
                <p className="timeline-dates">{job.dates}</p>
                {job.note && <p className="timeline-note">{job.note}</p>}
              </div>
            </div>
            <ul className="bullet-list">
              {job.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
