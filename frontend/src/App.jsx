import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Detail from "./pages/detailPage/Detail";
import Store from "./pages/psd store/Store";
import Services from "./pages/ServicePage/ServicePage";
import Contact from "./pages/contact/Contact";
import Cart from "./pages/cart/Cart";
import UserDashboard from "./Dashboard/UserDashboard/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard/pages/AdminDashboard";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/SignUp/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import Web from "./pages/website/Web";
const App = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/user-dashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
   <Route path="/detail/:id" element={<Detail />} />
        <Route path="/psd-store" element={<Store />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/web" element={<Web />} />

        <Route
  path="/reset-password/:uid/:token"
  element={<ResetPassword />}
/>
<Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

<Route
    path="/reset-password/:uid/:token"
    element={<ResetPassword />}
/>
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

  <Route
    path="/payment/success"
    element={
      <ProtectedRoute>
        <PaymentSuccess />
      </ProtectedRoute>
    }
  />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRole="customer">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </>
  );
};

export default App;