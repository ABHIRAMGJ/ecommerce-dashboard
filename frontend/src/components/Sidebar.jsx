import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

const links = [
  { to: "/admin", label: "Overview", icon: OverviewIcon, end: true },
  { to: "/admin/orders", label: "Orders", icon: OrdersIcon },
  { to: "/admin/products", label: "Products", icon: ProductsIcon },
  { to: "/admin/inventory", label: "Inventory", icon: InventoryIcon },
];

export default function Sidebar() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <aside className="rail">
      <div className="rail-brand">
        <span className="mark" />
        <span className="name">StoreOps</span>
        <span className="tag">v1.0</span>
      </div>
      <nav>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => "rail-link" + (isActive ? " active" : "")}
          >
            <Icon className="icon" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="rail-foot">
        NORTHBOUND WAREHOUSE
        <br />
        SHIFT 08:00–17:00
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <NavLink to="/" style={{ color: "var(--ink-dim)", textDecoration: "none" }}>
            ← Back to store
          </NavLink>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "var(--red)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              padding: 0,
              textAlign: "left",
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

function OverviewIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M2 9.5 6 5l3 3 5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 13.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="2.5" y="3" width="11" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 6.5h6M5 9h6M5 11.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ProductsIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M2 5 8 2l6 3v6l-6 3-6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 5l6 3 6-3M8 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function InventoryIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="2" y="2.5" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2.5" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9.5" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9.5" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
