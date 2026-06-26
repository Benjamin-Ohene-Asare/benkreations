import { NavLink } from "react-router-dom";
import {
  HiViewGrid,
  HiShoppingBag,
  HiClipboardList,
  HiUsers,
  HiDownload,
  HiCog,
  HiLogout,
} from "react-icons/hi";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="admin-brand">
        <div className="admin-brand-mark">B</div>

        <div>
          <h2>PSD Store</h2>
          <p>Admin Panel</p>
        </div>
      </div>

      <nav className="admin-nav">
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
          onClick={closeSidebar}
        >
          <HiViewGrid />
          <span>Dashboard</span>
        </NavLink>
<NavLink
  to="/admin-dashboard/categories"
  className={({ isActive }) =>
    isActive ? "admin-nav-link active" : "admin-nav-link"
  }
  onClick={closeSidebar}
>
  <HiClipboardList />
  <span>Categories</span>
</NavLink>
        <NavLink
          to="/admin-dashboard/products/add"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
          onClick={closeSidebar}
        >
          <HiShoppingBag />
          <span>Add Product</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/orders"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
          onClick={closeSidebar}
        >
          <HiClipboardList />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/customers"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
          onClick={closeSidebar}
        >
          <HiUsers />
          <span>Customers</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/downloads"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
          onClick={closeSidebar}
        >
          <HiDownload />
          <span>Downloads</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/settings"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
          onClick={closeSidebar}
        >
          <HiCog />
          <span>Settings</span>
        </NavLink>
      </nav>

      <button type="button" className="admin-logout">
        <HiLogout />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;