import { useEffect, useState } from "react";
import {
  HiViewGrid,
  HiCollection,
  HiClipboardList,
  HiCog,
  HiCamera,
  HiMail,
  HiShieldCheck,
  HiChevronRight,
  HiCube,
  HiShoppingBag,
  HiCalendar,
  HiUser,
} from "react-icons/hi";
import api from "../../services/api";
import "./dashboard.css";

const navLinks = [
  { label: "Dashboard", icon: HiViewGrid, key: "dashboard" },
  { label: "My Library", icon: HiCollection, key: "library" },
  { label: "Order History", icon: HiClipboardList, key: "orders" },
  { label: "Account Settings", icon: HiCog, key: "settings" },
];

export default function UserDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [accountStats, setAccountStats] = useState({
    purchases: 0,
    totalOrders: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const res = await api.get("/account/profile/");

        setUser({
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          plan: "PRO MEMBER",
          memberSince: res.data.user.member_since,
          avatar: res.data.user.avatar,
        });

        setAccountStats({
          purchases: res.data.stats.purchases,
          totalOrders: res.data.stats.total_orders,
          completed: res.data.stats.completed,
        });
      } catch (err) {
        console.log("Failed to fetch account details:", err);
      }
    };

    fetchAccountDetails();
  }, []);

  if (!user) {
    return <div className="dash-page">Loading account...</div>;
  }

  const stats = [
    { label: "Purchases", value: accountStats.purchases, icon: HiCube, color: "blue" },
    { label: "Total Orders", value: accountStats.totalOrders, icon: HiShoppingBag, color: "green" },
    { label: "Completed", value: accountStats.completed, icon: HiCalendar, color: "purple" },
    { label: "Member Since", value: user.memberSince, icon: HiUser, color: "orange" },
  ];

  return (
    <div className="dash-page">
      <div className="dash-topbar">
        <span className="dash-topbar-title">My Account</span>
        <button
          className="dash-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className="dash-layout">
        <aside className={`dash-sidebar ${menuOpen ? "open" : ""}`}>
          <div className="profile-card">
            <div className="avatar-wrap">
              <div className="avatar">{user.avatar}</div>
              <button className="avatar-camera" aria-label="Upload photo">
                <HiCamera />
              </button>
            </div>

            <h2 className="profile-name">{user.name}</h2>
            <span className="profile-badge">{user.plan}</span>

            <div className="profile-meta">
              <div className="meta-row">
                <HiMail className="meta-icon" />
                <span>{user.email}</span>
              </div>

              <div className="meta-row">
                <HiShieldCheck className="meta-icon" />
                <span>Role: {user.role}</span>
              </div>
            </div>
          </div>

          <nav className="dash-nav">
            {navLinks.map(({ label, icon: Icon, key }) => (
              <button
                key={key}
                className={`nav-item ${activeNav === key ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(key);
                  setMenuOpen(false);
                }}
              >
                <Icon className="nav-icon" />
                <span>{label}</span>
                <HiChevronRight className="nav-arrow" />
              </button>
            ))}
          </nav>
        </aside>

        <main className="dash-main">
          <div className="stats-grid">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="stat-card">
                <div className={`stat-icon-wrap color-${color}`}>
                  <Icon />
                </div>

                <div className="stat-info">
                  <span className="stat-label">{label}</span>
                  <span className="stat-value">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="panels-grid">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <HiCube className="panel-icon orange" />
                  <h3>Recent Library Items</h3>
                </div>

                <button className="view-all-btn">View All</button>
              </div>

              <div className="panel-body empty-state">
                <div className="empty-icon">📦</div>
                <p>No assets yet.</p>
                <span>Items you purchase will appear here</span>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <HiShoppingBag className="panel-icon orange" />
                  <h3>Recent Orders</h3>
                </div>

                <button className="view-all-btn">View All</button>
              </div>

              <div className="panel-body empty-state">
                <div className="empty-icon">🛒</div>
                <p>No orders yet.</p>
                <span>Your order history will show here</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}