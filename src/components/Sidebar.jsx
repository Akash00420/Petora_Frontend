import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { LayoutDashboard, Heart, Plus, Bell, QrCode, User } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pets", label: "My Pets", icon: Heart, end: true },
  { to: "/pets/add", label: "Add Pet", icon: Plus },
  { to: "/lost", label: "Lost Pets", icon: Bell, alertKey: true },
  { to: "/scan", label: "Scan a Tag", icon: QrCode },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = () => {
  const { pets } = useSelector((state) => state.pets);
  const hasLost = pets.some((p) => p.isLost);

  return (
    <aside className="sidebar no-print">
      <nav>
        {links.map(({ to, label, icon: Icon, end, alertKey }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <Icon size={16} />
            <span>{label}</span>
            {alertKey && hasLost && <em className="sidebar-alert">Alert</em>}
          </NavLink>
        ))}
      </nav>

      <div className="network-status">
        <span className="status-dot" />
        <span>Safe Pet Network Active</span>
      </div>
    </aside>
  );
};

export default Sidebar;