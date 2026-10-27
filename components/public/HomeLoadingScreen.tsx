import { HeartPulse } from "lucide-react";

export default function HomeLoadingScreen() {
  return (
    <div className="home-loading-screen" role="status" aria-live="polite" aria-label="Loading The Balm of Gilead">
      <div className="home-loading-glow" aria-hidden="true" />
      <div className="home-loading-content">
        <div className="home-loading-logo-wrap" aria-hidden="true">
          <HeartPulse className="home-loading-logo" strokeWidth={2.25} />
        </div>
        <p className="home-loading-brand">The Balm of Gilead</p>
        <p className="home-loading-tagline">Health education · wellness · community care</p>
        <p className="home-loading-message">Preparing your experience</p>
        <div className="home-loading-track" aria-hidden="true">
          <span />
        </div>
        <span className="home-loading-caption">A moment while we get things ready</span>
      </div>
    </div>
  );
}
