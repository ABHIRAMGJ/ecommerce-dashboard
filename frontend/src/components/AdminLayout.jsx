import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
