import Image from "next/image";

export default function HomeLoadingScreen() {
  return (
    <div className="home-loading-screen" role="status" aria-live="polite" aria-label="Loading Remsam Homestead">
      <div className="home-loading-glow" aria-hidden="true" />
      <div className="home-loading-content">
        <div className="home-loading-logo-wrap" aria-hidden="true">
          <Image
            className="home-loading-logo"
            src="/logo.png"
            alt=""
            width={80}
            height={80}
            preload
          />
        </div>
        <p className="home-loading-brand">Remsam Homestead</p>
        <p className="home-loading-tagline">Faith, Family, Farming</p>
        <p className="home-loading-message">Preparing your experience</p>
        <div className="home-loading-track" aria-hidden="true">
          <span />
        </div>
        <span className="home-loading-caption">A moment while we get things ready</span>
      </div>
    </div>
  );
}
