import { profile } from "../data";

export default function Summary() {
  return (
    <section className="section" id="about">
      <h2>Professional Summary</h2>
      <p className="summary-text">{profile.summary}</p>
    </section>
  );
}
