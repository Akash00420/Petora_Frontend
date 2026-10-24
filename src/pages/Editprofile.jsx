import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Phone, User, Mail, Check } from "lucide-react";
import { clearAuthStatus, fetchMe, updateProfile } from "../Reducer/AuthSlice";
import { thunkError } from "../utils/helpers";
import Loader from "../components/Loader";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(clearAuthStatus());
    dispatch(fetchMe());
  }, [dispatch]);

  // fill the form once the user is available
  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "" });
  }, [user?.name, user?.phone]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const phone = form.phone.trim();
    if (!name) return setError("Name is required");
    if (phone && !/^\+?[0-9\s-]{7,15}$/.test(phone)) {
      return setError("Please enter a valid phone number");
    }

    setSubmitting(true);
    try {
      await dispatch(updateProfile({ name, phone })).unwrap();
      navigate("/profile");
    } catch (err) {
      setError(thunkError(err));
      setSubmitting(false);
    }
  };

  if (!user) return <Loader text="Loading profile..." />;

  return (
    <div className="narrow account-page">
      <div className="page-header">
        <div>
          <nav className="breadcrumb">
            Account <span>/</span> <Link to="/profile">User Profile</Link> <span>/</span>{" "}
            <strong>Edit</strong>
          </nav>
          <h1>Edit profile</h1>
          <p className="page-sub">Update the details finders will see when they scan your pet's tag.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card acct-form" onSubmit={handleSubmit}>
        <div className="acct-field">
          <label htmlFor="name">Full name</label>
          <div className="acct-input">
            <User size={15} />
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength="60"
              placeholder="Your full name"
            />
          </div>
        </div>

        <div className="acct-field">
          <label htmlFor="phone">Phone number</label>
          <div className="acct-input">
            <Phone size={15} />
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>
          <small className="acct-hint">Shown to whoever scans your pet's tag and used for SOS alerts.</small>
        </div>

        <div className="acct-field">
          <label htmlFor="email">Email address</label>
          <div className="acct-input is-readonly">
            <Mail size={15} />
            <input id="email" value={user.email} readOnly disabled />
          </div>
          <small className="acct-hint">Your email is your login and can't be changed here.</small>
        </div>

        <div className="acct-footer">
          <Link to="/profile" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <Check size={15} /> {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;