import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";

import StorefrontLayout from "./components/StorefrontLayout.jsx";
import Home from "./pages/storefront/Home.jsx";
import ProductDetail from "./pages/storefront/ProductDetail.jsx";
import Cart from "./pages/storefront/Cart.jsx";
import Checkout from "./pages/storefront/Checkout.jsx";
import OrderConfirmation from "./pages/storefront/OrderConfirmation.jsx";

import Login from "./pages/admin/Login.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Overview from "./pages/admin/Overview.jsx";
import Products from "./pages/admin/Products.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Inventory from "./pages/admin/Inventory.jsx";

export default function App() {
  return (
    <CartProvider>
      <AdminAuthProvider>
        <Routes>
          {/* Shopper-facing storefront */}
          <Route path="/" element={<StorefrontLayout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<OrderConfirmation />} />
          </Route>

          {/* Password gate */}
          <Route path="/admin/login" element={<Login />} />

          {/* Password-protected admin dashboard */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Overview />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="inventory" element={<Inventory />} />
            </Route>
          </Route>
        </Routes>
      </AdminAuthProvider>
    </CartProvider>
  );
}
