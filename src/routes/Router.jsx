// routes/Router.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import CreateHospital from "../pages/Home/CreateHospital";
import OPDeskScreen from "../pages/OPDeskScreen";
import FrontOfficeDeskScreen from "../pages/FrontOfficeDeskScreen";
import PlatformDeskScreen from "../pages/PlatformDeskScreen";

// Protected Route Component
function ProtectedRoute({ children, user, requiredRole }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  REGISTER: "/register",
  OP_DESK: "/opdesk",
  FRONT_DESK: "/frontdesk",
  PLATFORM_DESK: "/platformdesk",
};

export default function AppRouter({ user, onLogin, onLogout }) {
  return (
    <BrowserRouter basename="/">
      <Routes>
        {/* Login Route - Home. The very first page anyone sees. */}
        <Route
          path={ROUTES.HOME}
          element={<LoginPage onLogin={onLogin} />}
        />

        {/* Main menu / dashboard — where a doctor lands right after login;
            OP Desk and everything else is reached from its top nav. */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute user={user} requiredRole="doctor">
              <Dashboard user={user} onLogout={onLogout} />
            </ProtectedRoute>
          }
        />

        {/* Create New Hospital ("new book") Route */}
        <Route
          path={ROUTES.REGISTER}
          element={<CreateHospital />}
        />

        {/* OP Desk Route - Protected for doctors */}
        <Route
          path={ROUTES.OP_DESK}
          element={
            <ProtectedRoute user={user} requiredRole="doctor">
              <OPDeskScreen user={user} onLogout={onLogout} />
            </ProtectedRoute>
          }
        />
        
        {/* Front Office Desk Route - Protected for office staff */}
        <Route 
          path={ROUTES.FRONT_DESK} 
          element={
            <ProtectedRoute user={user} requiredRole="office">
              <FrontOfficeDeskScreen user={user} onLogout={onLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Platform Desk Route - Protected for platform admin */}
        <Route 
          path={ROUTES.PLATFORM_DESK} 
          element={
            <ProtectedRoute user={user} requiredRole="platform">
              <PlatformDeskScreen user={user} onLogout={onLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect /medics to /medics/ */}
        <Route path="" element={<Navigate to="/" replace />} />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}