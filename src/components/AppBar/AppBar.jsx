import { useState, useEffect, useRef } from "react";
import {
  Bell, Maximize2, Minimize2, ChevronDown,
  ClipboardList, BedDouble, Stethoscope
} from "lucide-react";
import OPListModal            from "../../modal/Oplistmodal";
import UserMenuDropdown       from "./UserMenuDropdown";
import NotificationDropdown   from "./NotificationDropdown";

export default function AppBar({ user, onLogout, saved, onOPListClick, patients }) {
  const [isFullscreen,      setIsFullscreen]      = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu,      setShowUserMenu]      = useState(false);
  const [showSavedToast,    setShowSavedToast]    = useState(false);
  const [showOPListModal,   setShowOPListModal]   = useState(false);

  const doctorSectionRef  = useRef(null);
  const notificationRef   = useRef(null);

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

  // Click-outside: notification panel
  useEffect(() => {
    const handler = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
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
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(v => !v);
    if (showUserMenu) setShowUserMenu(false);
  };

  const handleSelectPatient = (patient) => {
    if (onOPListClick) onOPListClick(patient);
    setShowOPListModal(false);
  };

  return (
    <>
      <div className="flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--color-sidebar-bg) 0%, #0a4a6e 100%)" }}>
        <div className="px-4 py-2 flex items-center justify-between">

          {/* ── Left: Doctor section with dropdown ─────────────────────── */}
          <div ref={doctorSectionRef} className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={toggleUserMenu}>
              <div className="p-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                <Stethoscope size={16} style={{ color: "white" }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
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
                <div className="text-[0.6rem]" style={{ color: "rgba(255,255,255,0.7)" }}>General Medicine</div>
              </div>
            </div>

            {/* UserMenuDropdown — handles its own sub-popups internally */}
            {showUserMenu && (
              <UserMenuDropdown
                user={user}
                onLogout={onLogout}
                onClose={() => setShowUserMenu(false)}
              />
            )}
          </div>

          {/* ── Center: Logo ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v20M9 5c0-1.657 1.343-3 3-3s3 1.343 3 3c0 3-6 3-6 6s6 3 6 6c0 1.657-1.343 3-3 3s-3-1.343-3-3"
                  stroke="white" strokeWidth="2" strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <span className="font-display text-lg font-extrabold text-white tracking-tighter">Medix</span>
              <span className="ml-2 text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                OP DESK v2.0
              </span>
            </div>
          </div>

          {/* ── Right: Actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* OP / IP List buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOPListModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
                style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >
                <ClipboardList size={12} /> OP List
              </button>
              <button
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
                style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >
                <BedDouble size={12} /> IP List
              </button>
            </div>

            {/* Notification Bell */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={toggleNotifications}
                className="p-1.5 rounded-lg transition-all hover:bg-white/10 relative"
              >
                <Bell size={16} style={{ color: "white" }} />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
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

      {/* OP List Modal */}
      {showOPListModal && (
        <OPListModal
          onClose={() => setShowOPListModal(false)}
          onSelectPatient={handleSelectPatient}
          doctor={user?.name || "Dr. Aravind Kumar"}
          date={new Date().toLocaleDateString()}
          time={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        />
      )}

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