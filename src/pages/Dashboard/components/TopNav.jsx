import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X, UserRound, Settings, LogOut, Cross } from "lucide-react";
import NavDropdown from "./NavDropdown";
import navMenus from "../../../data/navMenus.json";

// publicMode=true (Home page, nobody logged in yet) swaps the notification
// bell + profile dropdown for Login / Create Hospital links.
export default function TopNav({ user, notificationCount = 0, onLogout, publicMode = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-100">
      {/* ── Row 1: Brand, search, notifications, profile ── */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2563eb, #0ea5e9)" }}>
            <Cross size={20} color="white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold text-slate-800 leading-tight truncate">Medix HMS</div>
            <div className="text-[0.68rem] text-slate-400 leading-tight truncate hidden sm:block">Hospital Management System</div>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input type="text" placeholder="Search patient, module..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-300 transition-colors" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {publicMode ? (
            <>
              <Link to="/login" className="hidden sm:inline-block px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-3.5 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #2563eb, #0ea5e9)" }}>
                Create New Hospital
              </Link>
            </>
          ) : (
            <>
              <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors" title="Notifications">
                <Bell size={18} className="text-slate-500" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                    style={{ width: 16, height: 16, background: "#ef4444" }}>
                    {notificationCount}
                  </span>
                )}
              </button>

              <div ref={userRef} className="relative">
                <button onClick={() => setShowUserMenu(v => !v)} className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-center rounded-full bg-blue-100 flex-shrink-0" style={{ width: 32, height: 32 }}>
                    <UserRound size={16} className="text-blue-500" />
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="text-xs font-bold text-slate-800">{user?.name || "Dr. John Doe"}</div>
                    <div className="text-[0.65rem] text-slate-400">{user?.roleName || "Administrator"}</div>
                  </div>
                  <ChevronDown size={13} className="text-slate-400 transition-transform hidden sm:block" style={{ transform: showUserMenu ? "rotate(180deg)" : "none" }} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border border-slate-100 bg-white z-50 py-1.5 animate-fade-in">
                    <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-800 truncate">{user?.name || "Dr. John Doe"}</div>
                      <div className="text-[0.65rem] text-slate-400 truncate">{user?.email || "admin@medixhms.com"}</div>
                    </div>
                    <button className="w-full flex items-center gap-2 text-left px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      <UserRound size={14} /> My Profile
                    </button>
                    <button className="w-full flex items-center gap-2 text-left px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                      <Settings size={14} /> Account Settings
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-2 text-left px-3.5 py-2 text-xs font-semibold hover:bg-red-50" style={{ color: "#ef4444" }}>
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile menu toggle — nav row collapses behind this below md */}
          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors">
            {mobileOpen ? <X size={19} className="text-slate-600" /> : <Menu size={19} className="text-slate-600" />}
          </button>
        </div>
      </div>

      {/* ── Row 2: Nav menus (desktop) ── */}
      <div className="hidden md:flex items-center gap-1 px-4 sm:px-6 pb-2 flex-wrap">
        {navMenus.map(menu => (
          <NavDropdown key={menu.key} label={menu.label} icon={menu.icon} items={menu.items} />
        ))}
      </div>

      {/* ── Mobile nav menu ── */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-1 border-t border-slate-100 pt-2">
          <div className="relative mb-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search patient, module..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50" />
          </div>
          {navMenus.map(menu => (
            <details key={menu.key} className="group">
              <summary className="flex items-center justify-between px-2 py-2 rounded-lg text-sm font-semibold text-slate-700 cursor-pointer list-none hover:bg-slate-50">
                {menu.label}
                <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pl-4 flex flex-col">
                {menu.items.map(item => (
                  <span key={item} className="px-2 py-1.5 text-xs text-slate-500">{item}</span>
                ))}
              </div>
            </details>
          ))}
          {publicMode && (
            <Link to="/login" onClick={() => setMobileOpen(false)}
              className="mt-1 px-2 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:hidden">
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
