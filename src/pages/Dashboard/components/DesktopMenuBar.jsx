import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { mainMenuItems } from "../mainMenuData";

function MenuItems({ items, onSelect, submenu = false }) {
  return (
    <div className={submenu ? "em-submenu" : "em-dropdown"} role="menu">
      {items.map((item, index) => item.separator ? (
        <div key={`separator-${index}`} className="em-menu-separator" role="separator" />
      ) : (
        <div key={item.label} className="em-menu-item-host">
          <button type="button" className="em-menu-item" role="menuitem" onClick={() => !item.children && onSelect(item.action)}>
            <span>{item.label}</span>
            {item.children && <ChevronRight size={16} aria-hidden="true" />}
          </button>
          {item.children && <MenuItems items={item.children} onSelect={onSelect} submenu />}
        </div>
      ))}
    </div>
  );
}

export default function DesktopMenuBar({ onLogout }) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenu(null);
    };
    const closeOnEscape = event => event.key === "Escape" && setOpenMenu(null);
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleSelect = action => {
    setOpenMenu(null);
    if (action === "create-book") navigate("/register");
    if (action === "op-appointments") navigate("/op-appointments");
    if (action === "op-desk") navigate("/opdesk");
    if (action === "logout") onLogout?.();
  };

  return (
    <nav ref={menuRef} className="em-menu-bar" aria-label="Main menu">
      {mainMenuItems.map(menu => (
        <div key={menu.label} className={`em-menu ${openMenu === menu.label ? "is-open" : ""}`}>
          <button type="button" className="em-menu-trigger" aria-haspopup="menu" aria-expanded={openMenu === menu.label}
            onClick={() => setOpenMenu(current => current === menu.label ? null : menu.label)}
            onMouseEnter={() => openMenu && setOpenMenu(menu.label)}>
            {menu.label}
          </button>
          {openMenu === menu.label && <MenuItems items={menu.items} onSelect={handleSelect} />}
        </div>
      ))}
    </nav>
  );
}
