import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthStatus, resetPassword } from "../Reducer/AuthSlice";

// Target of the link in the reset email: /reset-password/:token
const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setFieldError("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return setFieldError("Passwords do not match");
    setFieldError("");

    try {
      await dispatch(resetPassword({ token, password: form.password })).unwrap();
      navigate("/dashboard", { replace: true });
    } catch {
      // the error message is shown from the auth state
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card form" onSubmit={handleSubmit} noValidate>
        <h1>Set a new password</h1>
        <p className="muted">Choose a password you haven't used before.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {fieldError && <div className="alert alert-error">{fieldError}</div>}

        <div className="form-group">
          <label htmlFor="password">New password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Reset password"}
        </button>

        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;