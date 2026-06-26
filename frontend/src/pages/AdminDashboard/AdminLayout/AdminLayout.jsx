import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./admin.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="admin-main">
        <Header setSidebarOpen={setSidebarOpen} />

        <section className="admin-content">
          {children}
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;