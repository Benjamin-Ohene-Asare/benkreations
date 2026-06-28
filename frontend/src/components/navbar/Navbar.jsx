import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiMenuAlt3,
  HiX,
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

  const avatarRef = useRef(null);
  const mobileAvatarRef = useRef(null);
  const dropdownRef = useRef(null);

  const [authToken, setAuthToken] = useState(() => localStorage.getItem("access"));
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
    return () => window.removeEventListener("authChange", syncAuth);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      const clickedAvatar =
        avatarRef.current?.contains(e.target) ||
        mobileAvatarRef.current?.contains(e.target);

      const clickedDropdown = dropdownRef.current?.contains(e.target);

      if (!clickedAvatar && !clickedDropdown) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const user = authUser;
  const token = authToken;
  const isLoggedIn = token && user;

  const dashboardPath =
    user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard";

  const getInitials = () => {
    if (!user) return "";
    const first = user.first_name?.charAt(0) || "";
    const last = user.last_name?.charAt(0) || "";

    return (
      (first + last).toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const closeAllMenus = () => {
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));

    closeAllMenus();
    navigate("/login", { replace: true });
  };

  const ProfileDropdown = () =>
    createPortal(
      <>
        <div
          className="profile-menu-backdrop"
          onClick={() => setProfileOpen(false)}
        />

        <div className="profile-menu-portal" ref={dropdownRef}>
          <Link
            to={dashboardPath}
            className="profile-menu-item"
            onClick={closeAllMenus}
          >
            <HiViewGrid />
            {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
          </Link>

          <Link
            to={dashboardPath}
            className="profile-menu-item"
            onClick={closeAllMenus}
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
      </>,
      document.body
    );

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link" onClick={closeAllMenus}>
        <div className="logo-wrap">
          <img src={logo} alt="Benkreations" className="logo-img" />
          <span className="logo-name">Benkreations</span>
        </div>
      </Link>

      <div
        className="menu-icon"
        onClick={() => {
          setMenuOpen(!menuOpen);
          setProfileOpen(false);
        }}
      >
        {menuOpen ? <HiX /> : <HiMenuAlt3 />}
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={closeAllMenus}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/services"
            className={location.pathname === "/services" ? "active" : ""}
            onClick={closeAllMenus}
          >
            Services
          </Link>
        </li>

        <li>
          <Link
            to="/psd-store"
            className={location.pathname === "/psd-store" ? "active" : ""}
            onClick={closeAllMenus}
          >
            PSD Store
          </Link>
        </li>

        <li>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
            onClick={closeAllMenus}
          >
            Contact
          </Link>
        </li>

        <li className="mobile-nav-actions">
          <button
            type="button"
            className="nav-icon"
            onClick={() => {
              closeAllMenus();
              if (!isLoggedIn) return navigate("/login");
              navigate("/cart");
            }}
          >
            <HiShoppingCart />
          </button>

          {isLoggedIn ? (
            <div ref={mobileAvatarRef}>
              <button
                type="button"
                className="nav-avatar"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((prev) => !prev);
                }}
              >
                {getInitials()}
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-cta" onClick={closeAllMenus}>
              Login
            </Link>
          )}

          <Link to="/contact" className="nav-cta" onClick={closeAllMenus}>
            Get In Touch
          </Link>
        </li>
      </ul>

      <div className="nav-right">
        <button
          type="button"
          className="nav-icon"
          onClick={() => {
            closeAllMenus();
            if (!isLoggedIn) return navigate("/login");
            navigate("/cart");
          }}
        >
          <HiShoppingCart />
        </button>

        {isLoggedIn ? (
          <div className="profile-wrap" ref={avatarRef}>
            <button
              type="button"
              className="nav-avatar"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((prev) => !prev);
              }}
            >
              {getInitials()}
            </button>
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

      {profileOpen && isLoggedIn && <ProfileDropdown />}
    </nav>
  );
}

export default Navbar;