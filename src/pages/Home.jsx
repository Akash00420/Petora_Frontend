import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const features = [
  { icon: "🏷️", title: "Unique QR tag", text: "Every pet gets its own Pet ID and a printable QR code for the collar." },
  { icon: "📱", title: "Instant profile", text: "Whoever scans the tag sees your pet's photo and how to reach you. No app needed." },
  { icon: "🚨", title: "Lost alerts", text: "Report a pet lost with the last seen spot. Your community can see it right away." },
  { icon: "📊", title: "Scan history", text: "Know when your pet's tag was scanned, so you can tell someone found them." },
];

const steps = [
  { title: "Create an account", text: "Sign up in under a minute." },
  { title: "Add your pet", text: "Upload a photo and details. We generate the QR tag." },
  { title: "Print and attach", text: "Put the QR on a collar tag. You're covered." },
];

const Home = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Bring lost pets home with a simple scan.</h1>
          <p>
            Petora gives every pet a QR tag linked to a profile. If your pet goes missing, anyone who finds them can
            reach you in seconds.
          </p>
          <div className="hero-actions">
            {token ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create free account
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Login
                </Link>
              </>
            )}
            <Link to="/scan" className="btn btn-outline btn-lg">
              Found a pet? Enter its code
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-heading">Everything you need to keep pets safe</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="card feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 className="section-heading">How it works</h2>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <span className="step-number">{i + 1}</span>
              <h3>{s.title}</h3>
              <p className="muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;