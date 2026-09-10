import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Topbar from "../../components/Topbar.jsx";
import { DashboardAPI } from "../../api/client.js";

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

const STATUS_ORDER = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLOR = {
  pending: "var(--amber)",
  processing: "var(--ink-dim)",
  shipped: "var(--green)",
  delivered: "var(--green)",
  cancelled: "var(--red)",
};

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    DashboardAPI.summary()
      .then(setData)
      .catch((e) => setError(e.response?.data?.error || "Could not reach the API. Is the backend running?"));
  }, []);

  return (
    <>
      <Topbar title="Overview" sub="STORE OPERATIONS — NORTHBOUND WAREHOUSE" />
      <div className="content">
        {error && <div className="error-banner">{error}</div>}

        {!data && !error && <div className="loading">LOADING MANIFEST…</div>}

        {data && (
          <>
            <div className="stamp">
              <div className="stamp-cell">
                <div className="stamp-num amber">{money(data.revenueToday)}</div>
                <div className="stamp-label">Revenue today</div>
              </div>
              <div className="stamp-cell">
                <div className="stamp-num">{data.ordersToday}</div>
                <div className="stamp-label">Orders placed today</div>
              </div>
              <div className="stamp-cell">
                <div className="stamp-num">{data.pendingOrders}</div>
                <div className="stamp-label">Awaiting fulfillment</div>
              </div>
              <div className="stamp-cell">
                <div className="stamp-num">{data.lowStockCount}</div>
                <div className="stamp-label">Items at or below threshold</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <div className="card-head">
                  <h2>Revenue, last 14 days</h2>
                  <span className="meta">ALL CHANNELS</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.trend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e8a33d" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#e8a33d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#2a2e37" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => d.slice(5)}
                      stroke="#6b7080"
                      fontSize={11}
                      fontFamily="IBM Plex Mono"
                      tickLine={false}
                      axisLine={{ stroke: "#2a2e37" }}
                    />
                    <YAxis
                      stroke="#6b7080"
                      fontSize={11}
                      fontFamily="IBM Plex Mono"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                      width={54}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#22262e",
                        border: "1px solid #383e4a",
                        fontFamily: "IBM Plex Mono",
                        fontSize: 12,
                      }}
                      formatter={(v) => [money(v), "Revenue"]}
                      labelStyle={{ color: "#a3a8b3" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#e8a33d" strokeWidth={2} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <div className="card-head">
                  <h2>Orders by status</h2>
                </div>
                {STATUS_ORDER.map((s) => {
                  const count = data.statusCounts[s] || 0;
                  const max = Math.max(...Object.values(data.statusCounts), 1);
                  return (
                    <div className="stock-row" key={s}>
                      <div>
                        <div className="row-title" style={{ textTransform: "capitalize" }}>{s}</div>
                        <div className="stock-bar" style={{ width: 120 }}>
                          <div
                            style={{
                              width: `${(count / max) * 100}%`,
                              background: STATUS_COLOR[s],
                            }}
                          />
                        </div>
                      </div>
                      <div className="stamp-num" style={{ fontSize: 18 }}>
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <div className="card-head">
                  <h2>Low stock</h2>
                  <Link to="/admin/inventory" className="meta" style={{ textDecoration: "none" }}>
                    VIEW INVENTORY →
                  </Link>
                </div>
                {data.lowStock.length === 0 && <div className="empty">Nothing below threshold right now.</div>}
                {data.lowStock.map((p) => (
                  <div className="stock-row" key={p.id}>
                    <div>
                      <div className="row-title">{p.name}</div>
                      <div className="row-sub">{p.sku}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="stamp-num" style={{ fontSize: 16, color: p.stock === 0 ? "var(--red)" : "var(--amber)" }}>
                        {p.stock}
                      </div>
                      <div className="row-sub">of {p.lowStockThreshold} min</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-head">
                  <h2>Top movers</h2>
                  <span className="meta">BY UNITS, 14D</span>
                </div>
                {data.topProducts.length === 0 && <div className="empty">No sales in this window yet.</div>}
                {data.topProducts.map((p) => (
                  <div className="stock-row" key={p.sku}>
                    <div>
                      <div className="row-title">{p.name}</div>
                      <div className="row-sub">{p.sku}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="stamp-num" style={{ fontSize: 16 }}>
                        {p.units}
                      </div>
                      <div className="row-sub">{money(p.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
