import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiMenuAlt3,
  HiX,
  HiMoon,
  HiBookmark,
  HiShoppingCart,
  HiUser,
  HiLogout,
  HiViewGrid,
} from "react-icons/hi";
import "./nav.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("access")
  );

  const [authUser, setAuthUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      setAuthToken(localStorage.getItem("access"));
      setAuthUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  const token = authToken;
  const user = authUser;
  const isLoggedIn = token && user;

  const dashboardPath =
    user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard";

  const getInitials = () => {
    if (!user) return "";

    const first = user.first_name?.charAt(0) || "";
    const last = user.last_name?.charAt(0) || "";

    return (
      `${first}${last}`.toUpperCase() ||
      user.email?.charAt(0).toUpperCase()
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));

    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <div className="logo-wrap">
          <img src={logo} alt="Benkreations" className="logo-img" />
          <span className="logo-name">Benkreations</span>
        </div>
      </Link>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <HiX /> : <HiMenuAlt3 />}
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/services"
            className={location.pathname === "/services" ? "active" : ""}
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            to="/psd-store"
            className={location.pathname === "/psd-store" ? "active" : ""}
          >
            PSD Store
          </Link>
        </li>
        <li>
          <Link
            to="/blog"
            className={location.pathname === "/blog" ? "active" : ""}
          >
            Blog
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </Link>
        </li>
      </ul>

      <div className="nav-right">
        <button className="nav-icon" aria-label="Toggle theme">
          <HiMoon />
        </button>

        <button
          className="nav-icon"
          aria-label="Saved"
          onClick={() => {
            if (!isLoggedIn) {
              navigate("/login");
              return;
            }
            navigate("/saved");
          }}
        >
          <HiBookmark />
        </button>

        <button
          className="nav-icon"
          aria-label="Cart"
          onClick={() => {
            if (!isLoggedIn) {
              navigate("/login");
              return;
            }

            navigate("/cart");
          }}
        >
          <HiShoppingCart />
        </button>

        {isLoggedIn ? (
          <div className="profile-wrap">
            <button
              type="button"
              className="nav-avatar"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {getInitials()}
            </button>

            {profileOpen && (
              <div className="profile-menu">
                <Link
                  to={dashboardPath}
                  className="profile-menu-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <HiViewGrid />
                  {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </Link>

                <Link
                  to={dashboardPath}
                  className="profile-menu-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <HiUser />
                  Profile
                </Link>

                <button
                  type="button"
                  className="profile-menu-item logout"
                  onClick={handleLogout}
                >
                  <HiLogout />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-cta">
            Login
          </Link>
        )}

        <Link to="/contact" className="nav-cta">
          Get In Touch
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;