import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthStatus, registerUser } from "../Reducer/AuthSlice";
import { validateRegister } from "../utils/validators";

const Register = () => {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    const { name, email, phone, password } = form;
    dispatch(registerUser({ name: name.trim(), email: email.trim(), phone: phone.trim(), password }));
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card form" onSubmit={handleSubmit} noValidate>
        <h1>Create your account</h1>
        <p className="muted">It takes a minute to protect your pet.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone (shown when your pet's tag is scanned)</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="auth-links">
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;