import { projects } from "../data";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <ul className="tag-list">
              {project.tools.map((tool) => (
                <li className="tag" key={tool}>
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
