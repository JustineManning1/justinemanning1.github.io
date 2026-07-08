import { profile } from "../data";

export default function Header() {
  return (
    <header className="hero">
      <div className="hero-inner">
        <p className="eyebrow">Portfolio &amp; Resume</p>
        <h1>{profile.name}</h1>
        <p className="role">{profile.title}</p>
        <ul className="contact-list">
          <li>{profile.location}</li>
          <li>
            <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>{profile.phone}</a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
        </ul>
        <div className="hero-actions">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            Contact Me
          </a>
          <a className="btn btn-secondary" href={profile.resumeFile} download>
            Download Resume
          </a>
        </div>
      </div>
    </header>
  );
}
