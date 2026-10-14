import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthStatus, forgotPassword } from "../Reducer/AuthSlice";
import { isEmail } from "../utils/validators";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setFieldError("Enter a valid email address");
      return;
    }
    setFieldError("");
    dispatch(forgotPassword(email.trim()));
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card form" onSubmit={handleSubmit} noValidate>
        <h1>Forgot password?</h1>
        <p className="muted">Enter your email and we'll send you a reset link.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {fieldError && <span className="field-error">{fieldError}</span>}
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;