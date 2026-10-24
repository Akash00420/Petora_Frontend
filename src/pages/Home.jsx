import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Small inline icons (Feather / Lucide style) so no extra package is needed
const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const icons = {
  qr: (
    <Icon>
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </Icon>
  ),
  arrow: (
    <Icon>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Icon>
  ),
  search: (
    <Icon>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  ),
  tag: (
    <Icon>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </Icon>
  ),
  phone: (
    <Icon>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </Icon>
  ),
  bell: (
    <Icon>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  ),
  chart: (
    <Icon>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </Icon>
  ),
};

const features = [
  {
    icon: "tag",
    tone: "amber",
    title: "Unique QR tag",
    text: "Every pet gets its own Pet ID and a printable QR code ready for their favorite collar.",
  },
  {
    icon: "phone",
    tone: "indigo",
    title: "Instant profile",
    text: "Whoever scans the tag sees your pet's photo and instant contact instructions. No app needed.",
  },
  {
    icon: "bell",
    tone: "rose",
    title: "Lost alerts",
    text: "Report a pet lost with the last seen spot. Your local community and network can see it right away.",
  },
  {
    icon: "chart",
    tone: "green",
    title: "Scan history",
    text: "Know when your pet's tag was scanned, so you have immediate peace of mind.",
  },
];

const steps = [
  { title: "Create an account", text: "Sign up in under a minute with your basic details to start setting up your pets." },
  { title: "Add your pet", text: "Upload a photo and details. We instantly generate a dedicated, secure QR tag profile." },
  { title: "Print and attach", text: "Put the QR code on a collar tag or holder. You're covered wherever they wander." },
];

const Home = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="hero-badge">
            {icons.qr} Smart QR pet safety system
          </span>

          <h1>
            Bring lost pets home with a
            <br />
            <span className="gradient-text">simple scan</span>.
          </h1>

          <p>
            Petora gives every pet a QR tag linked to a profile. If your pet goes missing, anyone who finds them can
            reach you in seconds.
          </p>

          <div className="hero-actions">
            {token ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to dashboard {icons.arrow}
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create free account {icons.arrow}
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Login
                </Link>
              </>
            )}
            <Link to="/scan" className="btn btn-outline btn-lg">
              {icons.search} Found a pet? Enter its code
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-intro">
            <h2>Everything you need to keep pets safe</h2>
            <p>Designed for real-world emergencies where seconds and clear communication matter most.</p>
          </div>

          <div className="feature-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <span className={`feature-icon tone-${f.tone}`}>{icons[f.icon]}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-tint">
        <div className="container">
          <div className="section-intro">
            <h2>How it works</h2>
            <p>Get your pet fully protected in three straightforward steps.</p>
          </div>

          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step-number">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;