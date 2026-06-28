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
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getCustomerDashboard } from "../../services/dashboardApi";
import "./dashboard.css";
import { changePassword } from "../../services/accountApi";
const navLinks = [
  { label: "Dashboard", icon: HiViewGrid, key: "dashboard" },
  { label: "My Library", icon: HiCollection, key: "library" },
  { label: "Order History", icon: HiClipboardList, key: "orders" },
  { label: "Account Settings", icon: HiCog, key: "settings" },
];

export default function UserDashboard() {
const handleChangePassword = async () => {
  try {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    await changePassword({
      old_password: passwordForm.oldPassword,
      new_password: passwordForm.newPassword,
      confirm_password: passwordForm.confirmPassword,
    });

    alert("Password changed successfully.");

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (err) {
    alert(err.response?.data?.message || "Failed to change password.");
  }
};



  const [activeNav, setActiveNav] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [libraryItems, setLibraryItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [settingsOpen, setSettingsOpen] = useState("profile");
  const [profileForm, setProfileForm] = useState({ name: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [accountStats, setAccountStats] = useState({
    purchases: 0,
    totalOrders: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const res = await api.get("/account/profile/");

        const userData = {
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          plan: "PRO MEMBER",
          memberSince: res.data.user.member_since,
          avatar: res.data.user.avatar,
        };

        setUser(userData);
        setProfileForm({ name: res.data.user.name });

        const dashboardRes = await getCustomerDashboard();

        setAccountStats({
          purchases: dashboardRes.data.stats.purchases,
          totalOrders: dashboardRes.data.stats.total_orders,
          completed: dashboardRes.data.stats.completed,
        });

        setLibraryItems(dashboardRes.data.library || []);
        setRecentOrders(dashboardRes.data.orders || []);
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
        <button className="dash-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
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
                <Link to="/">Home</Link>
              </div>
{/* 
              <div className="meta-row">
                <HiMail className="meta-icon" />
                <span>{user.email}</span>
              </div>

              <div className="meta-row">
                <HiShieldCheck className="meta-icon" />
                <span>Role: {user.role}</span>
              </div> */}
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
          {activeNav === "dashboard" && (
            <>
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

                    <button className="view-all-btn" onClick={() => setActiveNav("library")}>
                      View All
                    </button>
                  </div>

                  <div className="panel-body">
                    {libraryItems.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon"></div>
                        <p>No assets yet.</p>
                        <span>Items you purchase will appear here</span>
                      </div>
                    ) : (
                      libraryItems.map((item) => (
                        <div key={`${item.order_id}-${item.product_id}`} className="library-row">
                          <img src={item.thumbnail} alt={item.title} />
                          <div>
                            <strong>{item.title}</strong>
                            <span>{item.category}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      <HiShoppingBag className="panel-icon orange" />
                      <h3>Recent Orders</h3>
                    </div>

                    <button className="view-all-btn" onClick={() => setActiveNav("orders")}>
                      View All
                    </button>
                  </div>

                  <div className="panel-body">
                    {recentOrders.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon"></div>
                        <p>No orders yet.</p>
                        <span>Your order history will show here</span>
                      </div>
                    ) : (
                      recentOrders.map((order) => (
                        <div key={order.id} className="order-row">
                          <div>
                            <strong>Order #{order.id}</strong>
                            <span>{order.reference}</span>
                          </div>

                          <div>
                            <strong>₵{Number(order.amount).toFixed(2)}</strong>
                            <span>{order.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeNav === "library" && (
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <HiCollection className="panel-icon orange" />
                  <h3>My Library</h3>
                </div>
              </div>

              <div className="panel-body">
                {libraryItems.length === 0 ? (
                  <div className="empty-state">
                    <p>No purchased assets yet.</p>
                  </div>
                ) : (
                  libraryItems.map((item) => (
                    <div
  key={`${item.order_id}-${item.product_id}`}
  className="library-row"
>
  <img src={item.thumbnail} alt={item.title} />

  <div className="library-info">
    <strong>{item.title}</strong>
    <span>{item.category}</span>
  </div>

  <div className="library-actions">
    {item.psd_file && (
      <a
        href={item.psd_file}
        className="download-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download PSD
      </a>
    )}

    {item.zip_file && (
      <a
        href={item.zip_file}
        className="download-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download ZIP
      </a>
    )}
  </div>
</div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeNav === "orders" && (
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <HiClipboardList className="panel-icon orange" />
                  <h3>Order History</h3>
                </div>
              </div>

              <div className="panel-body">
                {recentOrders.length === 0 ? (
                  <div className="empty-state">
                    <p>No orders yet.</p>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="order-row">
                      <div>
                        <strong>Order #{order.id}</strong>
                        <span>{order.reference}</span>
                      </div>

                      <div>
                        <strong>₵{Number(order.amount).toFixed(2)}</strong>
                        <span>{order.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeNav === "settings" && (
            <div className="settings-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <HiCog className="panel-icon orange" />
                  <h3>Account Settings</h3>
                </div>
              </div>

              <div className="settings-tabs">
                <button
                  className={settingsOpen === "profile" ? "active" : ""}
                  onClick={() => setSettingsOpen("profile")}
                >
                  Update Profile
                </button>

                <button
                  className={settingsOpen === "password" ? "active" : ""}
                  onClick={() => setSettingsOpen("password")}
                >
                  Change Password
                </button>
              </div>

              {settingsOpen === "profile" && (
                <div className="settings-form">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                  />

                  <button className="settings-save-btn">Save Changes</button>
                </div>
              )}

              {settingsOpen === "password" && (
                <div className="settings-form">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                    }
                  />

                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                  />

                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />

              <button
  type="button"
  className="settings-save-btn"
  onClick={handleChangePassword}
>
  Update Password
</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}