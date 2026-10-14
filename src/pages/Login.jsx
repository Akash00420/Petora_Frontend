import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthStatus, loginUser } from "../Reducer/AuthSlice";
import { validateLogin } from "../utils/validators";

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  if (token) return <Navigate to={location.state?.from || "/dashboard"} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card form" onSubmit={handleSubmit} noValidate>
        <h1>Welcome back</h1>
        <p className="muted">Login to manage your pets and tags.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>
            New here? <Link to="/register">Create an account</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;