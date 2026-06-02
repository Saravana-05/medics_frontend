// src/pages/PlatformDeskScreen.jsx
import { useState } from "react";
import Navbar from "../components/PlatformDesk/Navbar";
import Sidebar from "../components/PlatformDesk/Sidebar";
import Footer from "../components/PlatformDesk/Footer";
import Body from "../components/PlatformDesk/Body";

export default function PlatformDeskScreen({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("clinic");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--color-surface-alt)", fontFamily: "var(--font-body)" }}>
      {/* Navbar */}
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <Sidebar 
          activeMenu={activeMenu} 
          onMenuChange={setActiveMenu} 
          isOpen={isSidebarOpen} 
        />

        {/* Body Content */}
        <Body activeMenu={activeMenu} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}