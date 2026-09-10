import { Fragment, useEffect, useState } from "react";
import Topbar from "../../components/Topbar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { OrderAPI } from "../../api/client.js";

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  function load() {
    setLoading(true);
    OrderAPI.list({ status: status || undefined, search: search || undefined })
      .then(setOrders)
      .catch((e) => setError(e.response?.data?.error || "Could not load orders."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  async function changeStatus(order, next) {
    await OrderAPI.setStatus(order._id, next);
    load();
  }

  return (
    <>
      <Topbar title="Orders" sub="FULFILLMENT QUEUE" />
      <div className="content">
        {error && <div className="error-banner">{error}</div>}

        <div className="toolbar">
          <input
            className="input"
            placeholder="Search order #, customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <div className="toolbar-filters">
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th className="num">Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="loading">
                    LOADING…
                  </td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No orders match this filter.
                  </td>
                </tr>
              )}
              {!loading &&
                orders.map((o) => (
                  <Fragment key={o._id}>
                    <tr
                      onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <div className="row-title">{o.orderNumber}</div>
                        <div className="row-sub">{new Date(o.createdAt).toLocaleString()}</div>
                      </td>
                      <td>
                        <div className="row-title">{o.customerName}</div>
                        <div className="row-sub">{o.customerEmail}</div>
                      </td>
                      <td className="num">{money(o.total)}</td>
                      <td>
                        <StatusBadge value={o.paymentStatus} />
                      </td>
                      <td>
                        <StatusBadge value={o.status} />
                      </td>
                      <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                        <select
                          className="select"
                          value={o.status}
                          onChange={(e) => changeStatus(o, e.target.value)}
                          style={{ fontSize: 12.5, padding: "6px 8px" }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expanded === o._id && (
                      <tr key={o._id + "-detail"}>
                        <td colSpan={6} style={{ background: "var(--bg)" }}>
                          <div style={{ padding: "6px 4px" }}>
                            {o.items.map((it) => (
                              <div className="stock-row" key={it.sku}>
                                <div>
                                  <div className="row-title">{it.name}</div>
                                  <div className="row-sub">
                                    {it.sku} · qty {it.qty}
                                  </div>
                                </div>
                                <div className="num" style={{ fontFamily: "var(--font-mono)" }}>
                                  {money(it.price * it.qty)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
