import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { OrderAPI } from "../../api/client.js";

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="sf-page">
        <h1>Checkout</h1>
        <div className="sf-empty">
          Your cart is empty. <Link to="/">Browse products →</Link>
        </div>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setPlacing(true);
    setError("");
    try {
      const order = await OrderAPI.place({
        customerName: name,
        customerEmail: email,
        items: items.map((i) => ({ product: i.productId, qty: i.qty })),
      });
      clear();
      navigate(`/order/${order._id}`, { state: { order } });
    } catch (err) {
      setError(err.response?.data?.error || "Could not place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="sf-page">
      <h1>Checkout</h1>

      {error && <div className="error-banner" style={{ color: "#b3462f", borderColor: "#b3462f", background: "#f7e4de", padding: "10px 14px", fontSize: 13, marginBottom: 18 }}>{error}</div>}

      <form onSubmit={submit}>
        <div className="sf-form-row">
          <label>Full name</label>
          <input className="sf-input" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="sf-form-row">
          <label>Email</label>
          <input
            className="sf-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ margin: "24px 0" }}>
          {items.map((i) => (
            <div className="sf-summary-row" key={i.productId}>
              <span>
                {i.name} × {i.qty}
              </span>
              <span>{money(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="sf-summary-row total">
            <span>Total</span>
            <span>{money(subtotal)}</span>
          </div>
        </div>

        <button type="submit" className="sf-btn" disabled={placing} style={{ width: "100%" }}>
          {placing ? "Placing order…" : `Place order — ${money(subtotal)}`}
        </button>
        <p style={{ fontSize: 11.5, color: "var(--sf-ink-faint)", marginTop: 12, textAlign: "center" }}>
          Demo checkout — no payment is actually collected.
        </p>
      </form>
    </div>
  );
}
