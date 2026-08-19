import DesktopMenuBar from "./components/DesktopMenuBar";
import medicalTeam from "./medicalTeamImage";
import "./dashboard.css";

export default function Dashboard({ onLogout }) {
  return (
    <main className="em-main-menu">
      <header className="em-title-bar">
        <span className="em-title">E-Medics</span>
      </header>

      <DesktopMenuBar onLogout={onLogout} />

      <section className="em-workspace" aria-label="E-Medics main menu workspace">
        <div className="em-vertical-brand" aria-hidden="true">E-Medics</div>
        <img className="em-medical-team" src={medicalTeam} alt="Medical professionals" />
        <div className="em-ladder-grid" aria-hidden="true">
          <span className="em-block em-block-1" />
          <span className="em-block em-block-2" />
          <span className="em-block em-block-3" />
          <span className="em-block em-block-4" />
          <span className="em-block em-block-5" />
          <span className="em-block em-block-6" />
        </div>
      </section>
    </main>
  );
}
