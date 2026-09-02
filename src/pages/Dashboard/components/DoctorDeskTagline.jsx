export default function DoctorDeskTagline({ className = "" }) {
  return (
    <p className={`em-doctor-desk-tagline ${className}`.trim()}>
      <span aria-hidden="true">... </span>
      <em>for</em> <span className="em-doctor-desk-name">Doctor&apos;s Desk</span>
    </p>
  );
}
