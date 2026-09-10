import { Link, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function StorefrontLayout() {
  const { count } = useCart();

  return (
    <div className="storefront-theme">
      <header className="sf-header">
        <Link to="/" className="sf-brand">
          <span className="mark" />
          <span className="name">StoreOps</span>
        </Link>
        <nav className="sf-nav">
          <Link to="/admin/login" className="sf-nav-link">
            Admin
          </Link>
          <Link to="/cart" className="sf-cart-link">
            Cart
            {count > 0 && <span className="sf-cart-count">{count}</span>}
          </Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
