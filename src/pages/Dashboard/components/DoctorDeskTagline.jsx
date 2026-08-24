export default function DoctorDeskTagline({ className = "" }) {
  return (
    <p className={`em-doctor-desk-tagline ${className}`.trim()}>
      <span aria-hidden="true">... </span>
      <em>for</em> Doctor&apos;s Desk
    </p>
  );
}
