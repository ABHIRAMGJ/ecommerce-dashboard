import { Link } from "react-router-dom";
import { categoryTint } from "../utils/categoryColors.js";

const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

export default function ProductTile({ product }) {
  const tint = categoryTint(product.category);
  console.log(product);
  return (
    <Link to={`/product/${product._id}`} className="sf-card">
      <div
        className="sf-tile"
        style={{ background: tint.bg, color: tint.fg }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}

          className="sf-tile-img"
        />
      </div>

      <div className="sf-card-name">{product.name}</div>
      <div className="sf-card-cat">{product.category}</div>
      <div className="sf-card-price">{money(product.price)}</div>

      {product.stock <= 0 && (
        <div className="sf-card-oos">Out of stock</div>
      )}
    </Link>
  );
}