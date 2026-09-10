import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductAPI } from "../../api/client.js";
import { useCart } from "../../context/CartContext.jsx";
import { categoryTint } from "../../utils/categoryColors.js";

const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

function describe(product) {
  if (!product) return "";
  return `${product.name} — a ${product.category.toLowerCase()} pick, made to earn a permanent spot in daily use rather than sit in a drawer.`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    ProductAPI.get(id)
      .then(setProduct)
      .catch(() => setError("Couldn't find that product."));
  }, [id]);

  if (error) return <div className="sf-page">{error}</div>;
  if (!product) return <div className="sf-page">Loading…</div>;

  const tint = categoryTint(product.category);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="sf-detail">
      <div
        className="sf-detail-tile"
        style={{ background: tint.bg }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="sf-detail-img"
        />
      </div>

      <div>
        <div className="sf-detail-cat">{product.category}</div>
        <h1>{product.name}</h1>

        <div className="sf-detail-price">
          {money(product.price)}
        </div>

        <p className="sf-detail-desc">
          {describe(product)}
        </p>

        {outOfStock ? (
          <p
            style={{
              color: "#b3462f",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Currently out of stock.
          </p>
        ) : (
          <div className="sf-qty-row">
            <div className="sf-qty-control">
              <button
                onClick={() =>
                  setQty((q) => Math.max(1, q - 1))
                }
              >
                −
              </button>

              <span>{qty}</span>

              <button
                onClick={() =>
                  setQty((q) =>
                    Math.min(product.stock, q + 1)
                  )
                }
              >
                +
              </button>
            </div>

            <span
              style={{
                fontSize: 12.5,
                color: "var(--sf-ink-faint)",
              }}
            >
              {product.stock} in stock
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="sf-btn"
            disabled={outOfStock}
            onClick={handleAdd}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>

          <button
            className="sf-btn sf-btn-outline"
            onClick={() => navigate("/cart")}
          >
            View cart
          </button>
        </div>
      </div>
    </div>
  );
}