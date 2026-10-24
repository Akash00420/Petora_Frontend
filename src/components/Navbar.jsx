import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PawPrint } from "lucide-react";
import { logoutUser } from "../Reducer/AuthSlice";
import { fileUrl } from "../utils/helpers";

const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

const Navbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0] || "there";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="navbar no-print">
      <div className={`navbar-inner${token ? " is-app" : ""}`}>
        <Link to={token ? "/dashboard" : "/"} className="brand">
          <span className="brand-mark">
            <PawPrint size={16} />
          </span>
          Petora
        </Link>

        {token ? (
          <div className="nav-right">
            <span className="user-chip">
              <span className="user-avatar">
                {user?.avatar ? (
                  <img src={fileUrl(user.avatar)} alt="" />
                ) : (
                  firstName.charAt(0).toUpperCase()
                )}
              </span>
              Hi, {firstName}
            </span>
            <button className="btn btn-outline btn-sm logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <nav className="nav-links">
            <NavLink to="/scan" className={linkClass}>
              Scan a Tag
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;