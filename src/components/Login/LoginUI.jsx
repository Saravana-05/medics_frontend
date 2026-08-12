import { Link } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, Stethoscope, UserRound } from "lucide-react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

export default function LoginUI({
  username,
  setUsername,
  password,
  setPassword,
  showPwd,
  setShowPwd,
  error,
  loading,
  showSuccess,
  rememberMe,
  setRememberMe,
  handleSubmit,
}) {
  return (
    <main className="medix-login-page">
      <style>{`
        @keyframes medix-spin { to { transform: rotate(360deg); } }
        @keyframes medix-pop { from { transform: scale(.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes medix-pulse { 50% { transform: scale(1.1) rotate(5deg); } }

        .medix-login-page {
          --aqua: #52d2ce;
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: clamp(24px, 7vh, 74px) clamp(20px, 3.5vw, 58px);
          background:
            radial-gradient(circle at 50% 47%, rgba(255,255,255,.96), rgba(239,239,239,.88) 56%, #d4d4d4 100%);
          color: #fff;
        }
        .medix-login-shell {
          width: min(1560px, 100%);
          min-height: min(790px, calc(100vh - clamp(48px, 14vh, 148px)));
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          background: #151616;
          box-shadow: 0 15px 34px rgba(0,0,0,.29), 0 2px 6px rgba(0,0,0,.28);
        }
        .medix-login-hero {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: clamp(92px, 14vh, 150px) 34px 50px;
          overflow: hidden;
          background:
            radial-gradient(circle at 48% 38%, rgba(116,230,225,.86), transparent 38%),
            linear-gradient(152deg, #54d0cc 0%, #45c6c2 55%, #229b9c 100%);
        }
        .medix-login-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,.05), transparent 58%, rgba(0,43,51,.14));
          pointer-events: none;
        }
        .medix-brand {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: baseline;
          gap: 21px;
          white-space: nowrap;
        }
        .medix-brand-name {
          font-family: "Segoe Script", "Brush Script MT", cursive;
          font-size: clamp(72px, 8.2vw, 132px);
          font-weight: 400;
          line-height: .9;
          letter-spacing: -8px;
          color: #fff;
          text-shadow: 0 7px 5px rgba(0,75,77,.35);
        }
        .medix-brand-tagline {
          color: #051515;
          font-family: Georgia, serif;
          font-size: clamp(18px, 1.65vw, 27px);
          font-style: italic;
        }
        .medix-brand-tagline strong { font-family: inherit; font-style: normal; font-weight: 800; }
        .medix-hero-icon {
          position: relative;
          z-index: 1;
          width: clamp(245px, 26vw, 385px);
          height: clamp(245px, 26vw, 385px);
          margin-top: 18px;
          color: #fff;
          filter: drop-shadow(9px 12px 4px rgba(5,83,86,.38));
          transform: rotate(-11deg);
          stroke-width: 1.35;
        }
        .medix-login-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 84px clamp(32px, 8vw, 142px) 62px;
          background:
            radial-gradient(circle at 53% 42%, #242525 0%, #171818 58%, #111212 100%);
        }
        .medix-register {
          position: absolute;
          top: clamp(40px, 7vh, 68px);
          right: clamp(35px, 5vw, 74px);
          display: flex;
          align-items: flex-start;
          gap: 18px;
          color: #fff;
          text-decoration: none;
        }
        .medix-register svg { width: 31px; height: 31px; stroke-width: 1.45; }
        .medix-register-copy { display: grid; line-height: 1.35; }
        .medix-register-copy strong { color: var(--aqua); font-size: 21px; }
        .medix-register-copy span { font-size: 16px; }
        .medix-register:hover strong { color: #80ebe7; }
        .medix-login-form { width: min(100%, 410px); }
        .medix-login-title {
          margin: 0 0 25px;
          text-align: center;
          font-size: 22px;
          line-height: 1.35;
          font-weight: 750;
          text-shadow: 0 2px 3px #000;
        }
        .medix-field { margin-top: 15px; }
        .medix-field label { display: block; margin-bottom: 5px; font-size: 14px; font-weight: 700; }
        .medix-input-wrap { position: relative; }
        .medix-field input {
          width: 100%;
          height: 54px;
          border: 1px solid #454747;
          border-radius: 7px;
          outline: none;
          padding: 0 48px 0 16px;
          background: rgba(35,36,36,.8);
          box-shadow: inset 0 0 20px rgba(0,0,0,.13);
          color: #fff;
          font-size: 16px;
          transition: border-color .18s, box-shadow .18s;
        }
        .medix-field input::placeholder { color: #e4e4e4; opacity: 1; }
        .medix-field input:focus { border-color: var(--aqua); box-shadow: 0 0 0 2px rgba(82,210,206,.12); }
        .medix-password-toggle {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          padding: 4px;
          border: 0;
          background: transparent;
          color: #f3f3f3;
          cursor: pointer;
        }
        .medix-password-toggle svg { width: 25px; height: 25px; stroke-width: 1.7; }
        .medix-forgot-row { display: flex; justify-content: flex-end; margin-top: 10px; }
        .medix-forgot {
          padding: 0;
          border: 0;
          background: none;
          color: #fff;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
        }
        .medix-forgot:hover { color: var(--aqua); }
        .medix-terms {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 27px;
          color: #eee;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
        }
        .medix-terms input { position: absolute; opacity: 0; pointer-events: none; }
        .medix-check {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 4px;
          border: 1px solid #82e5e1;
          background: var(--aqua);
          color: #092323;
          box-shadow: 0 2px 8px rgba(0,0,0,.28);
        }
        .medix-check svg { width: 15px; height: 15px; opacity: 0; stroke-width: 3; }
        .medix-terms input:checked + .medix-check svg { opacity: 1; }
        .medix-terms a { color: #fff; text-underline-offset: 2px; }
        .medix-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 17px;
          padding: 10px 12px;
          border: 1px solid rgba(248,113,113,.5);
          border-radius: 7px;
          background: rgba(127,29,29,.28);
          color: #fecaca;
          font-size: 12px;
        }
        .medix-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 118px;
          height: 43px;
          margin: 29px auto 0;
          padding: 0 27px;
          border: 0;
          border-radius: 7px;
          background: linear-gradient(135deg, #65ddd8, #3bc6c2);
          color: #071c1c;
          font-size: 16px;
          font-weight: 800;
          box-shadow: 0 5px 15px rgba(0,0,0,.2);
          cursor: pointer;
          transition: transform .18s, box-shadow .18s;
        }
        .medix-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 21px rgba(42,204,198,.22); }
        .medix-submit:disabled { opacity: .65; cursor: wait; }
        .medix-submit-spinner { animation: medix-spin .8s linear infinite; }
        .medix-success-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          background: rgba(6,20,20,.72);
          backdrop-filter: blur(5px);
        }
        .medix-success-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 34px 42px;
          border: 1px solid rgba(82,210,206,.38);
          border-radius: 15px;
          background: #191b1b;
          box-shadow: 0 22px 60px rgba(0,0,0,.45);
          animation: medix-pop .28s ease-out;
        }
        .medix-success-icon { color: var(--aqua); animation: medix-pulse 1.1s ease-in-out infinite; }
        .medix-success-card strong { font-size: 18px; }
        .medix-success-card p { margin: 0; color: #c7cdcd; font-size: 13px; }

        @media (max-width: 900px) {
          .medix-login-page { padding: 0; place-items: stretch; background: #151616; }
          .medix-login-shell { min-height: 100vh; grid-template-columns: 1fr; }
          .medix-login-hero { min-height: 330px; padding: 55px 24px 25px; }
          .medix-brand-name { font-size: clamp(62px, 18vw, 94px); }
          .medix-brand-tagline { font-size: clamp(16px, 4.2vw, 22px); }
          .medix-hero-icon { width: 165px; height: 165px; margin-top: 10px; }
          .medix-login-panel { min-height: 570px; padding: 112px 27px 58px; }
          .medix-register { top: 32px; right: 28px; }
        }
        @media (max-width: 480px) {
          .medix-login-hero { min-height: 275px; padding-top: 43px; }
          .medix-brand { gap: 11px; }
          .medix-brand-name { font-size: 59px; letter-spacing: -5px; }
          .medix-brand-tagline { font-size: 14px; }
          .medix-hero-icon { width: 130px; height: 130px; }
          .medix-login-panel { padding-inline: 22px; }
          .medix-register-copy strong { font-size: 18px; }
          .medix-register-copy span { font-size: 14px; }
          .medix-terms { align-items: flex-start; font-size: 12px; }
        }
      `}</style>

      <section className="medix-login-shell" aria-label="Medix sign in">
        <div className="medix-login-hero" aria-hidden="true">
          <div className="medix-brand">
            <span className="medix-brand-name">Medix</span>
            <span className="medix-brand-tagline">... for <strong>Doctors</strong></span>
          </div>
          <Stethoscope className="medix-hero-icon" />
        </div>

        <div className="medix-login-panel">
          <Link className="medix-register" to="/register" aria-label="Register as a new user">
            <UserRound />
            <span className="medix-register-copy">
              <strong>Register</strong>
              <span>(New User)</span>
            </span>
          </Link>

          <form className="medix-login-form" onSubmit={handleSubmit}>
            <h1 className="medix-login-title">Sign in to Open Application</h1>

            <div className="medix-field">
              <label htmlFor="login-email">Email</label>
              <div className="medix-input-wrap">
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter Registered Email"
                />
              </div>
            </div>

            <div className="medix-field">
              <label htmlFor="login-password">Password</label>
              <div className="medix-input-wrap">
                <input
                  id="login-password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter Approved Password"
                />
                <button
                  className="medix-password-toggle"
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="medix-forgot-row">
              <button className="medix-forgot" type="button">Forgot Password?</button>
            </div>

            <label className="medix-terms">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span className="medix-check" aria-hidden="true"><CheckCircle2 /></span>
              <span>I agree all statements in <a href="#terms">terms of service</a></span>
            </label>

            {error && (
              <div className="medix-error" role="alert">
                <ErrorOutlineIcon sx={{ fontSize: 17 }} />
                <span>{error}</span>
              </div>
            )}

            <button className="medix-submit" type="submit" disabled={loading}>
              {loading && <Stethoscope className="medix-submit-spinner" size={18} />}
              {loading ? "Signing In" : "Sign In"}
            </button>
          </form>
        </div>
      </section>

      {showSuccess && (
        <div className="medix-success-overlay" role="status" aria-live="polite">
          <div className="medix-success-card">
            <Stethoscope className="medix-success-icon" size={50} />
            <strong>Login Successful</strong>
            <p>Taking you to your workspace...</p>
          </div>
        </div>
      )}
    </main>
  );
}
