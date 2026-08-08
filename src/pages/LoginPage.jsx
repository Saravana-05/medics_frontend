// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginUI from "../components/Login/LoginUI";
import { findHospitalByUsername } from "../services/hospitalRegistry";

// Route paths
const ROUTES = {
  DOCTOR: "/opdesk",
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

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPwd, setFocusPwd] = useState(false);
  const currentYear = new Date().getFullYear();

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

        onLogin(user, rememberMe);

        // Navigate based on role
        if (userCred.role === 'doctor') {
          navigate(ROUTES.DOCTOR);
        } else if (userCred.role === 'office') {
          navigate(ROUTES.OFFICE);
        } else if (userCred.role === 'platform') {
          navigate(ROUTES.PLATFORM);
        }
      } else if (hospital && hospital.password === password) {
        const user = {
          id: hospital.id,
          name: hospital.adminName,
          email: hospital.username,
          role: "doctor",
          roleName: hospital.hospitalName,
          bearerToken: `hospital-token-${Date.now()}`,
        };
        onLogin(user, rememberMe);
        navigate(ROUTES.DOCTOR);
      } else {
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 700);
  };

  const handleRoleSelect = (email, roleType) => {
    setUsername(email);
    setPassword("Password@123");
    
    // Auto-login for quick access
    setTimeout(() => {
      const userCred = HARDCODED_CREDENTIALS[email];
      if (userCred) {
        const user = {
          id: `hardcoded-${Date.now()}`,
          name: userCred.name,
          email: email,
          role: userCred.role,
          roleName: userCred.roleName,
          bearerToken: `hardcoded-token-${Date.now()}`,
        };
        onLogin(user, false);
        
        if (userCred.role === 'doctor') {
          navigate(ROUTES.DOCTOR);
        } else if (userCred.role === 'office') {
          navigate(ROUTES.OFFICE);
        } else if (userCred.role === 'platform') {
          navigate(ROUTES.PLATFORM);
        }
      }
    }, 100);
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
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      focusEmail={focusEmail}
      setFocusEmail={setFocusEmail}
      focusPwd={focusPwd}
      setFocusPwd={setFocusPwd}
      handleSubmit={handleSubmit}
      handleRoleSelect={handleRoleSelect}
      currentYear={currentYear}
    />
  );
}