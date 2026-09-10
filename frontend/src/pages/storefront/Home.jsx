import { useEffect, useState } from "react";
import ProductTile from "../../components/ProductTile.jsx";
import { ProductAPI } from "../../api/client.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ProductAPI.categories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    ProductAPI.list({ status: "active", category: category || undefined })
      .then(setProducts)
      .catch(() => setError("Could not load products. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <div className="sf-hero">
        <h1>Everyday goods, chosen well.</h1>
        <p>
          Kitchen, outdoor, lighting, storage, and textiles — a small catalog of things worth keeping
          around for a while.
        </p>
      </div>

      <div className="sf-chips">
        <button className={`sf-chip${category === "" ? " active" : ""}`} onClick={() => setCategory("")}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`sf-chip${category === c ? " active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: "0 40px 40px", color: "#b3462f", fontSize: 13.5 }}>{error}</div>
      )}
      {loading && <div style={{ padding: "0 40px 40px", color: "var(--sf-ink-faint)" }}>Loading…</div>}

      {!loading && (
        <div className="sf-grid">
          {products.map((p) => (
            <ProductTile key={p._id} product={p} />
          ))}
          {products.length === 0 && <div className="sf-empty">No products in this category yet.</div>}
        </div>
      )}
    </>
  );
}
