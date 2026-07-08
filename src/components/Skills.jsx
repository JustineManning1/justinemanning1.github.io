import { skillGroups } from "../data";

export default function Skills() {
  return (
    <section className="section" id="skills">
      <h2>Technical Skills</h2>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <div className="skill-card" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="tag-list">
              {group.skills.map((skill) => (
                <li className="tag" key={skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
