import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, logoutUser } from "../Reducer/AuthSlice";
import { formatDate } from "../utils/helpers";
import Loader from "../components/Loader";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  if (!user) return loading ? <Loader text="Loading profile..." /> : null;

  const rows = [
    ["Name", user.name],
    ["Email", user.email],
    ["Phone", user.phone || "Not added"],
    ["Account type", user.role],
    ["Member since", formatDate(user.createdAt)],
  ];

  return (
    <div className="narrow">
      <div className="page-header">
        <h1>My profile</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="card profile-card">
        <div className="profile-photo avatar">
          <span>{user.name?.charAt(0).toUpperCase()}</span>
        </div>

        <div className="profile-info">
          <h2>{user.name}</h2>
          <dl className="detail-list">
            {rows.map(([label, value]) => (
              <div className="detail-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <button className="btn btn-outline" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;