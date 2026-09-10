import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { categoryTint, initials } from "../../utils/categoryColors.js";

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="sf-page">
      <h1>Your cart</h1>

      {items.length === 0 && (
        <div className="sf-empty">
          Nothing here yet. <Link to="/">Browse products →</Link>
        </div>
      )}

      {items.map((item) => {
        const tint = categoryTint(item.category);
        return (
          <div className="sf-line-item" key={item.productId}>
            <div className="sf-line-tile" style={{ background: tint.bg, color: tint.fg }}>
              {initials(item.name)}
            </div>
            <div className="sf-line-info">
              <div className="sf-line-name">{item.name}</div>
              <div className="sf-line-sku">{item.sku}</div>
            </div>
            <div className="sf-qty-control">
              <button onClick={() => updateQty(item.productId, item.qty - 1)}>−</button>
              <span>{item.qty}</span>
              <button
                onClick={() => updateQty(item.productId, Math.min(item.stock, item.qty + 1))}
              >
                +
              </button>
            </div>
            <div style={{ width: 80, textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
              {money(item.price * item.qty)}
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              style={{ background: "none", border: "none", color: "var(--sf-ink-faint)", cursor: "pointer", fontSize: 18 }}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        );
      })}

      {items.length > 0 && (
        <>
          <div className="sf-summary-row total">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
            <button className="sf-btn sf-btn-outline" onClick={() => navigate("/")}>
              Keep browsing
            </button>
            <button className="sf-btn" onClick={() => navigate("/checkout")}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
