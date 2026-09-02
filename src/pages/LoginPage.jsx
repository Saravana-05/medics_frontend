// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginUI from "../components/Login/LoginUI";
import { findHospitalByUsername } from "../services/hospitalRegistry";

// Route paths — doctors land on Main Menu 2 first; OP Desk is reached from
// there (top-right "OP Desk" button / shortcut rail).
const ROUTES = {
  DOCTOR: "/main-menu-2",
  OFFICE: "/frontdesk",
  PLATFORM: "/platformdesk",
};

// Hardcoded credentials for all users
const HARDCODED_CREDENTIALS = {
  "opdesk@gmail.com": {
    password: "Password@123",
    role: "doctor",
    name: "Dr. Aravind Kumar",
    roleName: "OP Desk"
  },
  "frontdesk@gmail.com": {
    password: "Password@123",
    role: "office",
    name: "Priya Subramanian",
    roleName: "Front Desk"
  },
  "platformdesk@gmail.com": {
    password: "Password@123",
    role: "platform",
    name: "Platform Admin",
    roleName: "Platform Desk"
  }
};

// How long the animated success popup stays up before redirecting.
const SUCCESS_POPUP_MS = 1400;

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  // Pre-filled with the demo doctor login so the form works out of the box —
  // no separate quick-login tiles needed.
  const [username, setUsername] = useState("opdesk@gmail.com");
  const [password, setPassword] = useState("Password@123");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPwd, setFocusPwd] = useState(false);
  const currentYear = new Date().getFullYear();

  // Logs the user in immediately (so the rest of the app already has the
  // session) but delays navigation behind the animated success popup.
  const completeLogin = (user, destination) => {
    onLogin(user, rememberMe);
    setLoading(false);
    setShowSuccess(true);
    setTimeout(() => navigate(destination), SUCCESS_POPUP_MS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const userCred = HARDCODED_CREDENTIALS[username];
      // Hospitals created via "Create New Hospital" log in the same way as the
      // built-in demo doctor account — their admin lands straight on OP Desk.
      const hospital = !userCred ? findHospitalByUsername(username) : null;

      if (userCred && userCred.password === password) {
        const user = {
          id: `hardcoded-${Date.now()}`,
          name: userCred.name,
          email: username,
          role: userCred.role,
          roleName: userCred.roleName,
          bearerToken: `hardcoded-token-${Date.now()}`,
        };
        const destination = { doctor: ROUTES.DOCTOR, office: ROUTES.OFFICE, platform: ROUTES.PLATFORM }[userCred.role];
        completeLogin(user, destination);
      } else if (hospital && hospital.password === password) {
        const user = {
          id: hospital.id,
          name: hospital.adminName,
          email: hospital.username,
          role: "doctor",
          roleName: hospital.hospitalName,
          bearerToken: `hospital-token-${Date.now()}`,
        };
        completeLogin(user, ROUTES.DOCTOR);
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <LoginUI
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      showPwd={showPwd}
      setShowPwd={setShowPwd}
      error={error}
      loading={loading}
      showSuccess={showSuccess}
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      focusEmail={focusEmail}
      setFocusEmail={setFocusEmail}
      focusPwd={focusPwd}
      setFocusPwd={setFocusPwd}
      handleSubmit={handleSubmit}
      currentYear={currentYear}
    />
  );
}
