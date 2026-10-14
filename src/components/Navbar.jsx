import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Reducer/AuthSlice";

const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

const Navbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="navbar no-print">
      <div className="navbar-inner">
        <Link to={token ? "/dashboard" : "/"} className="brand">
          🐾 Petora
        </Link>

        <nav className="nav-links">
          <NavLink to="/scan" className={linkClass}>
            Scan a Tag
          </NavLink>

          {token ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <span className="nav-user">Hi, {user?.name?.split(" ")[0] || "there"}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;