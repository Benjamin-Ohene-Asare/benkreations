import { Routes, Route } from "react-router-dom";
import AdminLayout from "../AdminLayout/AdminLayout";

import DashboardHome from "./DashboardHome";
import AddProduct from "./AddProduct";
import Categories from "./Categories";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="products/add" element={<AddProduct />} />
         <Route path="categories" element={<Categories />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;