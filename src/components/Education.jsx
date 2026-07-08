import { education } from "../data";

export default function Education() {
  return (
    <section className="section" id="education">
      <h2>Education &amp; Certifications</h2>
      <div className="timeline">
        {education.map((item) => (
          <article className="timeline-item" key={item.title}>
            <div className="timeline-header">
              <div>
                <h3>{item.title}</h3>
                <p className="timeline-org">{item.org}</p>
              </div>
              <p className="timeline-dates">{item.dates}</p>
            </div>
            {item.bullets.length > 0 && (
              <ul className="bullet-list">
                {item.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
