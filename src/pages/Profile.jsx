import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Lock, Pencil, Camera, BadgeCheck, CalendarDays, TriangleAlert, ShieldCheck } from "lucide-react";
import { fetchMe, logoutUser, uploadProfilePhoto } from "../Reducer/AuthSlice";
import { fileUrl, formatDate } from "../utils/helpers";
import Loader from "../components/Loader";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(""); // validation errors only

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows picking the same file again later
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      return setPhotoError("Please choose a PNG or JPG image");
    }
    if (file.size > 5 * 1024 * 1024) {
      return setPhotoError("Image must be 5MB or smaller");
    }

    setPhotoError("");
    setPreview(URL.createObjectURL(file)); // show it instantly
    setUploading(true);
    try {
      await dispatch(uploadProfilePhoto(file)).unwrap();
    } catch {
      setPreview(""); // server error is shown by the {error} alert below
    }
    setUploading(false);
  };

console.log("avatar:", user?.avatar, "url:", user?.avatar && fileUrl(user.avatar));

if (!user) return loading ? <Loader text="Loading profile..." /> : null;

  const rows = [
    ["Name", user.name],
    [
      "Email",
      <>
        <span className="email">{user.email}</span>
        {user.isVerified && <span className="pill pill-green">Verified</span>}
      </>,
    ],
    ["Phone", user.phone || "Not added"],
    [
      "Account type",
      <>
        {user.role} <span className="muted-inline">• Standard Access</span>
      </>,
    ],
    [
      "Member since",
      <span className="with-icon">
        <CalendarDays size={14} /> {formatDate(user.createdAt)}
      </span>,
    ],
  ];

  return (
    <div className="narrow profile-page">
      <div className="page-header profile-header">
        <div>
          <nav className="breadcrumb">
            Account <span>/</span> <strong>User Profile</strong>
          </nav>
          <h1>My profile</h1>
          <p className="page-sub">
            Manage your personal credentials, contact details, and emergency communication reach.
          </p>
        </div>

        <div className="header-actions">
          <Link to="/change-password" className="btn btn-outline">
            <Lock size={15} /> Change Password
          </Link>
          <Link to="/profile/edit" className="btn btn-primary">
            <Pencil size={15} /> Edit Profile
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="card profile-card">
        <div className="profile-photo-panel">
          <div className={`profile-photo ${uploading ? "uploading" : ""}`}>
            {preview || user.avatar ? (
              <img src={preview || fileUrl(user.avatar)} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            )}

            <button
              type="button"
              className="photo-edit"
              aria-label="Change photo"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera size={14} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={handlePhotoChange}
            />
          </div>

          <span className="pill pill-green">
            <BadgeCheck size={13} /> Verified Owner
          </span>
          <small className="photo-hint">{uploading ? "Uploading..." : "PNG or JPG up to 5MB"}</small>
          {photoError && <small className="field-error">{photoError}</small>}
        </div>

        <div className="profile-info">
          <div className="profile-name-row">
            <h2>{user.name}</h2>
            <span className="pill pill-outline">Primary Account</span>
          </div>

          <dl className="detail-list">
            {rows.map(([label, value]) => (
              <div className="detail-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <p className="profile-note">All registered tags will direct finder queries to these details.</p>
        </div>
      </section>

      <div className="profile-grid">
        <section className="card info-card">
          <div className="info-head">
            <span className="info-icon danger">
              <TriangleAlert size={16} />
            </span>
            <div>
              <h3>Emergency Alert Broadcast</h3>
              <p>Contact preferences if a pet goes missing</p>
            </div>
            <Link to="/alerts" className="info-link">
              Manage
            </Link>
          </div>

          <div className="info-item">
            <span className="dot" />
            <div>
              <strong>Instant SMS Notification</strong>
              <small>Sends alerts to {user.phone || "your phone"}</small>
            </div>
            <em>Active</em>
          </div>
          <div className="info-item">
            <span className="dot" />
            <div>
              <strong>QR Tag Scan Push Alerts</strong>
              <small>Notified when a tag is scanned</small>
            </div>
            <em>Active</em>
          </div>
        </section>

        <section className="card info-card">
          <div className="info-head">
            <span className="info-icon blue">
              <ShieldCheck size={16} />
            </span>
            <div>
              <h3>Security &amp; Sessions</h3>
              <p>Protect account access and connected smart tags</p>
            </div>
            <span className="pill pill-green">Healthy</span>
          </div>

          <div className="info-line">
            <span>Two-Factor Authentication (2FA)</span>
            <strong>{user.twoFactorEnabled ? "Enabled" : "Disabled"}</strong>
          </div>
          <div className="info-line">
            <span>Current Session Location</span>
            <strong>{navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser"} • Active Now</strong>
          </div>
        </section>
      </div>

      <button className="btn btn-outline" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;