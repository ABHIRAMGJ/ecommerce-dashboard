import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { ProductAPI } from "../../api/client.js";

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [stockState, setStockState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);

  function load() {
    setLoading(true);
    ProductAPI.list({ stockState: stockState || undefined })
      .then(setProducts)
      .catch((e) => setError(e.response?.data?.error || "Could not load inventory."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [stockState]);

  async function adjust(p, delta) {
    setPending(p._id);
    try {
      await ProductAPI.adjustStock(p._id, delta);
      load();
    } finally {
      setPending(null);
    }
  }

  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);

  return (
    <>
      <Topbar title="Inventory" sub="STOCK ON HAND" />
      <div className="content">
        {error && <div className="error-banner">{error}</div>}

        <div className="stamp" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stamp-cell">
            <div className="stamp-num">{totalUnits}</div>
            <div className="stamp-label">Units on hand</div>
          </div>
          <div className="stamp-cell">
            <div className="stamp-num amber">{money(totalValue)}</div>
            <div className="stamp-label">Inventory value (at cost)</div>
          </div>
          <div className="stamp-cell">
            <div className="stamp-num">{products.filter((p) => p.stockState !== "ok").length}</div>
            <div className="stamp-label">Items needing attention</div>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbar-filters">
            <select className="select" value={stockState} onChange={(e) => setStockState(e.target.value)}>
              <option value="">All stock levels</option>
              <option value="ok">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th className="num">On hand</th>
                <th className="num">Threshold</th>
                <th>Level</th>
                <th className="num">Value at cost</th>
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
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    Nothing here.
                  </td>
                </tr>
              )}
              {!loading &&
                products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="row-title">{p.name}</div>
                      <div className="row-sub">{p.sku}</div>
                    </td>
                    <td className="num">{p.stock}</td>
                    <td className="num">{p.lowStockThreshold}</td>
                    <td>
                      <StatusBadge value={p.stockState} />
                    </td>
                    <td className="num">{money(p.stock * p.cost)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button className="btn" disabled={pending === p._id} onClick={() => adjust(p, -1)}>
                        −1
                      </button>{" "}
                      <button className="btn" disabled={pending === p._id} onClick={() => adjust(p, 1)}>
                        +1
                      </button>{" "}
                      <button className="btn" disabled={pending === p._id} onClick={() => adjust(p, 10)}>
                        +10
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
