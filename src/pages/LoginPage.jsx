// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginUI from "../components/Login/LoginUI";
import { loginUser, getAllUserRoles, mapRoleToUserType } from "../services/loginService";

// Route paths
const ROUTES = {
  DOCTOR: "/opdesk",
  OFFICE: "/frontdesk",
  PLATFORM: "/platformdesk",
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

    try {
      // Call login API
      const loginResponse = await loginUser(username, password);
      
      if (loginResponse?.data) {
        const userData = loginResponse.data;
        
        // Fetch user role
        const userRoles = await getAllUserRoles();
        const userRole = userRoles.find(u => u.email === userData.email);
        
        if (!userRole) {
          setError("User role not found");
          setLoading(false);
          return;
        }
        
        // Map role_name to user type
        const userType = mapRoleToUserType(userRole.role_name);
        
        // Create user object for app state
        const user = {
          id: userData.id,
          name: userData.full_name,
          email: userData.email,
          role: userType,
          roleName: userRole.role_name,
          bearerToken: userData.bearer_token,
        };
        
        // Store token in localStorage/sessionStorage for persistence
        if (rememberMe) {
          localStorage.setItem('authToken', userData.bearer_token);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('authToken', userData.bearer_token);
          sessionStorage.setItem('user', JSON.stringify(user));
        }
        
        // Call onLogin to set user in App state
        onLogin(user);
        
        // Navigate based on user type
        if (userType === 'doctor') {
          navigate(ROUTES.DOCTOR);
        } else if (userType === 'office') {
          navigate(ROUTES.OFFICE);
        } else if (userType === 'platform') {
          navigate(ROUTES.PLATFORM);
        }
      }
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (email) => {
    setUsername(email);
    setPassword("Password@123");
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