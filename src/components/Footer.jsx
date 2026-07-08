import { profile } from "../data";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        {profile.name} &middot;{" "}
        <a href={`mailto:${profile.email}`}>{profile.email}</a> &middot; {profile.phone}
      </p>
      <p className="footer-note">&copy; {new Date().getFullYear()} {profile.name}. Built with React.</p>
    </footer>
  );
}
