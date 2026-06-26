import {
  HiCurrencyDollar,
  HiShoppingCart,
  HiTemplate,
  HiUsers,
  HiDownload,
  HiTrendingUp,
} from "react-icons/hi";
import "./DashboardHome.css";

const DashboardHome = () => {
  const recentOrders = [];
  const topProducts = [];

  return (
    <div className="dashboard-home">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">
            <HiCurrencyDollar />
          </div>
          <div>
            <p>Total Revenue</p>
            <h3>₵0.00</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <HiShoppingCart />
          </div>
          <div>
            <p>Total Orders</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <HiTemplate />
          </div>
          <div>
            <p>Total Products</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers">
            <HiUsers />
          </div>
          <div>
            <p>Total Customers</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon downloads">
            <HiDownload />
          </div>
          <div>
            <p>Total Downloads</p>
            <h3>0</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon selling">
            <HiTrendingUp />
          </div>
          <div>
            <p>Top Selling</p>
            <h3>0</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <button>View All</button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders yet</h3>
              <p>Recent customer orders will appear here.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{/* map orders here later */}</tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Top Selling Products</h2>
            <button>View All</button>
          </div>

          {topProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No sales yet</h3>
              <p>Your best-performing PSD products will appear here.</p>
            </div>
          ) : (
            <div className="top-products">{/* map products here later */}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;