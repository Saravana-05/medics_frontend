// src/components/PlatformDesk/Footer.jsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 px-4 py-2 border-t" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between text-[0.65rem]">
        <div className="flex items-center gap-4">
          <span style={{ color: "var(--color-text-muted)" }}>© {currentYear} Medix Healthcare Platform</span>
          <span className="w-1 h-1 rounded-full" style={{ background: "var(--color-text-muted)" }} />
          <span style={{ color: "var(--color-text-muted)" }}>Platform Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:underline" style={{ color: "var(--color-text-muted)" }}>Privacy Policy</button>
          <button className="hover:underline" style={{ color: "var(--color-text-muted)" }}>Terms of Service</button>
          <button className="hover:underline" style={{ color: "var(--color-text-muted)" }}>Help</button>
        </div>
      </div>
    </footer>
  );
}