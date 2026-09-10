import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Modal from "../../components/Modal.jsx";
import { ProductAPI } from "../../api/client.js";

const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

const EMPTY_FORM = {
  name: "",
  sku: "",
  category: "",
  price: "",
  cost: "",
  stock: "",
  lowStockThreshold: "10",
  status: "active",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    ProductAPI.list({ search: search || undefined, category: category || undefined })
      .then(setProducts)
      .catch((e) => setError(e.response?.data?.error || "Could not load products."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    ProductAPI.categories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: String(p.price),
      cost: String(p.cost),
      stock: String(p.stock),
      lowStockThreshold: String(p.lowStockThreshold),
      status: p.status,
    });
    setModalOpen(true);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
    };
    try {
      if (editing) {
        await ProductAPI.update(editing._id, payload);
      } else {
        await ProductAPI.create(payload);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p) {
    if (!confirm(`Remove ${p.name} from the catalog?`)) return;
    await ProductAPI.remove(p._id);
    load();
  }

  return (
    <>
      <Topbar title="Products" sub="CATALOG">
        <button className="btn btn-primary" onClick={openCreate}>
          + Add product
        </button>
      </Topbar>
      <div className="content">
        {error && <div className="error-banner">{error}</div>}

        <div className="toolbar">
          <input
            className="input"
            placeholder="Search name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <div className="toolbar-filters">
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th className="num">Price</th>
                <th className="num">Stock</th>
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
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No products match this filter.
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
                    <td>{p.category}</td>
                    <td className="num">{money(p.price)}</td>
                    <td className="num">
                      {p.stock}{" "}
                      <StatusBadge value={p.stockState} />
                    </td>
                    <td>
                      <StatusBadge value={p.status} />
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button className="btn" onClick={() => openEdit(p)}>
                        Edit
                      </button>{" "}
                      <button className="btn btn-danger" onClick={() => remove(p)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit product" : "Add product"} onClose={() => setModalOpen(false)}>
          <form onSubmit={submit} className="modal-body">
            <div className="field">
              <label>Name</label>
              <input
                className="input"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="modal-row">
              <div className="field">
                <label>SKU</label>
                <input
                  className="input"
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Category</label>
                <input
                  className="input"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-row">
              <div className="field">
                <label>Price ($)</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Cost ($)</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-row">
              <div className="field">
                <label>Stock on hand</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Low stock threshold</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  required
                  value={form.lowStockThreshold}
                  onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label>Status</label>
              <select
                className="select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Add product"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
