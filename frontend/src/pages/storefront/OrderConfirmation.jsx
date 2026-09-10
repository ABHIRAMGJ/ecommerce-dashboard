import { useLocation, useParams, Link } from "react-router-dom";

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    // Direct visits without the navigation state (e.g. a page refresh) don't
    // re-fetch — order lookup by id is an admin-only endpoint in this build.
    return (
      <div className="sf-page sf-confirm">
        <h1>Order {id}</h1>
        <p style={{ color: "var(--sf-ink-dim)" }}>
          Thanks — your order was placed. Details aren't available after a page refresh in this demo.
        </p>
        <Link to="/" className="sf-btn" style={{ display: "inline-flex", marginTop: 20 }}>
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="sf-page sf-confirm">
      <div style={{ fontSize: 13, color: "var(--sf-green)", fontWeight: 700, marginBottom: 10 }}>ORDER PLACED</div>
      <h1 style={{ marginBottom: 8 }}>Thanks, {order.customerName.split(" ")[0]}.</h1>
      <p style={{ color: "var(--sf-ink-dim)", marginBottom: 30 }}>
        Order <strong style={{ fontFamily: "var(--font-mono)" }}>{order.orderNumber}</strong> is confirmed.
        A receipt was sent to {order.customerEmail}.
      </p>

      <div style={{ textAlign: "left", maxWidth: 420, margin: "0 auto" }}>
        {order.items.map((it) => (
          <div className="sf-summary-row" key={it.sku}>
            <span>
              {it.name} × {it.qty}
            </span>
            <span>{money(it.price * it.qty)}</span>
          </div>
        ))}
        <div className="sf-summary-row total">
          <span>Total</span>
          <span>{money(order.total)}</span>
        </div>
      </div>

      <Link to="/" className="sf-btn" style={{ display: "inline-flex", marginTop: 30 }}>
        Continue shopping
      </Link>
    </div>
  );
}
