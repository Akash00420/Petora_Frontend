import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/pets", label: "My Pets", icon: "🐕", end: true },
  { to: "/pets/add", label: "Add Pet", icon: "➕" },
  { to: "/lost", label: "Lost Pets", icon: "🚨" },
  { to: "/scan", label: "Scan a Tag", icon: "📱" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const Sidebar = () => (
  <aside className="sidebar no-print">
    <nav>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
        >
          <span>{link.icon}</span> {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;