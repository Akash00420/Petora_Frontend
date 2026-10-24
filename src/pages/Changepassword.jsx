import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { changePassword, clearAuthStatus } from "../Reducer/AuthSlice";
import { thunkError } from "../utils/helpers";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const PasswordField = ({ id, label, value, onChange, show, onToggle, placeholder, autoComplete }) => (
  <div className="acct-field">
    <label htmlFor={id}>{label}</label>
    <div className="acct-input">
      <Lock size={15} />
      <input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button type="button" className="acct-eye" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  </div>
);

const ChangePassword = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(emptyForm);
  const [show, setShow] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword, confirmPassword } = form;
    if (!currentPassword || !newPassword || !confirmPassword) return setError("Please fill in all fields");
    if (newPassword.length < 6) return setError("New password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("New passwords do not match");
    if (newPassword === currentPassword) return setError("New password must be different from the current one");

    setSubmitting(true);
    try {
      const message = await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      setSuccess(message || "Password updated successfully");
      setForm(emptyForm);
    } catch (err) {
      setError(thunkError(err));
    }
    setSubmitting(false);
  };

  return (
    <div className="narrow account-page">
      <div className="page-header">
        <div>
          <nav className="breadcrumb">
            Account <span>/</span> <Link to="/profile">User Profile</Link> <span>/</span>{" "}
            <strong>Change password</strong>
          </nav>
          <h1>Change password</h1>
          <p className="page-sub">Use a strong password you don't use anywhere else.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="card acct-form" onSubmit={handleSubmit}>
        <PasswordField
          id="currentPassword"
          label="Current password"
          value={form.currentPassword}
          onChange={handleChange}
          show={show.currentPassword}
          onToggle={() => toggle("currentPassword")}
          placeholder="Enter current password"
          autoComplete="current-password"
        />

        <PasswordField
          id="newPassword"
          label="New password"
          value={form.newPassword}
          onChange={handleChange}
          show={show.newPassword}
          onToggle={() => toggle("newPassword")}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          value={form.confirmPassword}
          onChange={handleChange}
          show={show.confirmPassword}
          onToggle={() => toggle("confirmPassword")}
          placeholder="Repeat new password"
          autoComplete="new-password"
        />

        <div className="acct-note">
          <ShieldCheck size={15} />
          <p>After changing your password you'll stay signed in on this device.</p>
        </div>

        <div className="acct-footer">
          <Link to="/profile" className="btn btn-outline">
            Back to profile
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;