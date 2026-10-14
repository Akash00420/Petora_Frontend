import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container empty">
    <span className="empty-icon">🐾</span>
    <h1>Page not found</h1>
    <p className="muted">This page wandered off. Let's get you back home.</p>
    <Link to="/" className="btn btn-primary">
      Back to home
    </Link>
  </div>
);

export default NotFound;