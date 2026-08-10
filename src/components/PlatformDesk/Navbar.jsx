// src/components/PlatformDesk/Navbar.jsx
import { useState } from "react";
import { Menu, X, Bell, User, LogOut, Settings, HelpCircle } from "lucide-react";

export default function Navbar({ user, onLogout, toggleSidebar, isSidebarOpen }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}>
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Left Section - Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg transition-all hover:bg-white/10"
          >
            {isSidebarOpen ? <X size={18} style={{ color: "white" }} /> : <Menu size={18} style={{ color: "white" }} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M9 5c0-1.657 1.343-3 3-3s3 1.343 3 3c0 3-6 3-6 6s6 3 6 6c0 1.657-1.343 3-3 3s-3-1.343-3-3"
                  stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className="font-display text-lg font-extrabold text-white tracking-tighter">Medix</span>
              <span className="ml-2 text-[0.6rem] font-bold px-2 py-0.5 rounded-full" 
                style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                Platform Admin
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Page Title */}
        <div className="hidden md:block">
          <h1 className="text-white font-semibold text-sm">Platform Management Dashboard</h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button className="p-1.5 rounded-lg transition-all hover:bg-white/10 relative">
            <Bell size={16} style={{ color: "white" }} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg transition-all hover:bg-white/10"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <User size={14} style={{ color: "white" }} />
              </div>
              <span className="text-xs font-medium text-white hidden sm:block">
                {user?.name || "Platform Admin"}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl z-50 animate-fade-in"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                <div className="p-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-sm font-semibold">{user?.name || "Platform Admin"}</div>
                  <div className="text-[0.6rem] mt-0.5" style={{ color: "var(--color-text-muted)" }}>Platform Administrator</div>
                  <div className="text-[0.55rem] mt-1" style={{ color: "var(--color-primary)" }}>{user?.email || "admin@medix.com"}</div>
                </div>
                <div className="py-1">
                  <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-surface-alt transition-colors flex items-center gap-2">
                    <User size={12} /> My Profile
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-surface-alt transition-colors flex items-center gap-2">
                    <Settings size={12} /> Settings
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-surface-alt transition-colors flex items-center gap-2">
                    <HelpCircle size={12} /> Help & Support
                  </button>
                  <hr className="my-1" style={{ borderColor: "var(--color-border)" }} />
                  <button 
                    onClick={onLogout} 
                    className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}