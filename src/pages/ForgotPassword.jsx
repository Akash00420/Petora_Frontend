import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthStatus, forgotPassword, resetPassword } from "../Reducer/AuthSlice";
import { isEmail } from "../utils/validators";

// Two steps on one page: 1) enter email -> OTP is emailed, 2) enter OTP + new password
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({ otp: "", password: "", confirmPassword: "" });
  const [fieldError, setFieldError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setFieldError("Enter a valid email address");
    setFieldError("");

    try {
      await dispatch(forgotPassword(email.trim())).unwrap();
      setStep("otp");
    } catch {
      // the error message is shown from the auth state
    }
  };

  const handleResend = () => {
    setFieldError("");
    dispatch(forgotPassword(email.trim()));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOtpChange = (e) =>
    setForm({ ...form, otp: e.target.value.replace(/\D/g, "").slice(0, 6) });

  const handleReset = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.otp)) return setFieldError("Enter the 6-digit OTP from your email");
    if (form.password.length < 6) return setFieldError("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return setFieldError("Passwords do not match");
    setFieldError("");

    try {
      await dispatch(resetPassword({ email: email.trim(), otp: form.otp, password: form.password })).unwrap();
      navigate("/dashboard", { replace: true });
    } catch {
      // the error message is shown from the auth state
    }
  };

  if (step === "email") {
    return (
      <div className="auth-wrap">
        <form className="card auth-card form" onSubmit={handleSendOtp} noValidate>
          <h1>Forgot password?</h1>
          <p className="muted">Enter your email and we'll send you a 6-digit OTP.</p>

          {error && <div className="alert alert-error">{error}</div>}
          {fieldError && <div className="alert alert-error">{fieldError}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <div className="auth-links">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <form className="card auth-card form" onSubmit={handleReset} noValidate>
        <h1>Enter your OTP</h1>
        <p className="muted">
          We sent a 6-digit code to <strong>{email}</strong>. It's valid for 10 minutes.
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        {fieldError && <div className="alert alert-error">{fieldError}</div>}

        <div className="form-group">
          <label htmlFor="otp">OTP</label>
          <input
            id="otp"
            name="otp"
            className="otp-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="······"
            value={form.otp}
            onChange={handleOtpChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">New password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="auth-links">
          <button type="button" className="link-button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈 Hide passwords" : "👁 Show passwords"}
          </button>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Reset password"}
        </button>

        <div className="auth-links">
          <button type="button" className="link-button" onClick={handleResend} disabled={loading}>
            Resend OTP
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setStep("email");
              setFieldError("");
              dispatch(clearAuthStatus());
            }}
          >
            Use a different email
          </button>
          <Link to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;