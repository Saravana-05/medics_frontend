import { useState, useEffect, useRef } from "react";
import {
  Maximize2, Minimize2, ChevronDown, X
} from "lucide-react";
import UserMenuDropdown from "./UserMenuDropdown";

export default function AppBar({ user, onLogout, savedMessage }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const hideTimerRef = useRef(null);

  const doctorSectionRef = useRef(null);

  // Saved snackbar — re-fires every time savedMessage.key changes (even if the
  // text repeats, e.g. saving Drug twice in a row), auto-hides after 3s, and
  // can be dismissed early via the close icon or by clicking the blur backdrop.
  useEffect(() => {
    if (savedMessage) {
      setShowSavedToast(true);
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setShowSavedToast(false), 3000);
    }
    return () => clearTimeout(hideTimerRef.current);
  }, [savedMessage?.key]);

  const dismissToast = () => {
    setShowSavedToast(false);
    clearTimeout(hideTimerRef.current);
  };

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
      <div className="flex-shrink-0 mb-1" style={{ background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}>
        <div className="px-4 py-2 flex items-center justify-between">

          {/* ── Left: Brand / Logo ────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <span style={{  letterSpacing: "0.5px" }} className="text-xl font-medium text-white">Trident Skiode - Medix</span>
          </div>

          {/* ── Right: Actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* ── Doctor Section ── */}
            <div ref={doctorSectionRef} className="relative">
              <div 
                className="flex items-center gap-1 cursor-pointer"
                onClick={toggleUserMenu}
              >
                <div className="text-lg font-semibold text-white">{user?.name || "Dr. Aravind Kumar"}</div>
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

      {/* Saved Snackbar — blurred full-screen backdrop while it's showing,
          auto-hides after 3s, dismissible early via the close icon or backdrop click. */}
      {showSavedToast && (
        <>
          <div className="fixed inset-0 z-40 transition-opacity duration-300"
            style={{ background: "rgba(15,23,42,0.35)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            onClick={dismissToast} />
          <div className="fixed top-1/2 left-1/2 z-50" style={{ transform: "translate(-50%, -50%)" }}>
            <div className="px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in"
              style={{ background: "var(--color-success)", color: "white" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold whitespace-nowrap">{savedMessage?.text || "Saved successfully!"}</span>
              <button onClick={dismissToast} className="flex items-center justify-center rounded-full flex-shrink-0 transition-all hover:bg-white/20" style={{ width: 20, height: 20 }} title="Close">
                <X size={13} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
