import { HiMenuAlt2, HiBell, HiSearch } from "react-icons/hi";

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <HiMenuAlt2 />
        </button>

        <div>
          <h1>Dashboard</h1>
          <p>Manage your PSD store and digital products.</p>
        </div>
      </div>

      <div className="admin-header-right">
        <div className="admin-search">
          <HiSearch />
          <input type="text" placeholder="Search..." />
        </div>

        <button type="button" className="admin-icon-btn">
          <HiBell />
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>

          <div>
            <h4>Admin</h4>
            <span>Store Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;