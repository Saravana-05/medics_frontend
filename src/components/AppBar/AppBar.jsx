import { useState, useEffect, useRef } from "react";
import {
  Maximize2, Minimize2, ChevronDown
} from "lucide-react";
import UserMenuDropdown from "./UserMenuDropdown";

export default function AppBar({ user, onLogout, saved }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const doctorSectionRef = useRef(null);

  // Saved toast
  useEffect(() => {
    if (saved) {
      setShowSavedToast(true);
      const t = setTimeout(() => setShowSavedToast(false), 4000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  // Click-outside: doctor menu
  useEffect(() => {
    const handler = (e) => {
      if (doctorSectionRef.current && !doctorSectionRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(v => !v);
  };

  return (
    <>
      <div className="flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}>
        <div className="px-4 py-2 flex items-center justify-between">

          {/* ── Left: Brand / Logo ────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-extrabold text-white tracking-tighter">Skylimit Digital - Medix</span>
          </div>

          {/* ── Right: Actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* ── Doctor Section ── */}
            <div ref={doctorSectionRef} className="relative">
              <div 
                className="flex items-center gap-1 cursor-pointer"
                onClick={toggleUserMenu}
              >
                <div className="text-xs font-semibold text-white">{user?.name || "Dr. Aravind Kumar"}</div>
                <ChevronDown
                  size={12}
                  style={{
                    color: "white",
                    transition: "transform 0.2s",
                    transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>

              {/* UserMenuDropdown */}
              {showUserMenu && (
                 <div className="absolute right-50 top-full mt-2 z-50">
                <UserMenuDropdown
                  user={user}
                  onLogout={onLogout}
                  onClose={() => setShowUserMenu(false)}
                />
                 </div>
              )}
            </div>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg transition-all hover:bg-white/10"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen
                ? <Minimize2 size={16} style={{ color: "white" }} />
                : <Maximize2 size={16} style={{ color: "white" }} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Saved Toast */}
      {showSavedToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2"
            style={{ background: "#10b981", color: "white" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold">Prescription Saved Successfully!</span>
          </div>
        </div>
      )}
    </>
  );
}