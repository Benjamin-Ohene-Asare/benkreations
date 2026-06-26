import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import api from "../../services/api";
import "./signup.css";

export default function SignUp() {
  const navigate = useNavigate();  
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const getBackendError = (err) => {
    const data = err.response?.data;

    if (!data) return "Something went wrong. Please try again.";

    if (typeof data === "string") return data;

    if (data.message) return data.message;

    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];

    if (Array.isArray(firstValue)) return firstValue[0];

    if (typeof firstValue === "string") return firstValue;

    return "Signup failed. Please check your details.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const nameParts = form.name.trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const payload = {
      first_name,
      last_name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      confirm_password: form.confirm_password,
    };

    try {
      const res = await api.post("/account/signup/", payload);

     setSuccess(
  res.data?.message ||
    "Account created successfully. Redirecting to login..."
);

setForm({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
});

setTimeout(() => {
  navigate("/login", { replace: true });
}, 1500);
    } catch (err) {
      setError(getBackendError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="brand-content">
          <div className="brand-logo">B</div>
          <h1 className="brand-title">Benkreations</h1>
          <p className="brand-tagline">
            Premium design assets, templates &amp; resources — all in one place.
          </p>
          <div className="brand-dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="form-card">
          <div className="form-top">
            <h2 className="form-title">Create your account</h2>
            <p className="form-subtitle">Join thousands of creators today</p>
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="name">Full Name</label>
              <div className="field-wrap">
                <HiUser className="field-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="field-input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={150}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="email">Email Address</label>
              <div className="field-wrap">
                <HiMail className="field-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="field-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="phone">Phone Number</label>
              <div className="field-wrap">
                <HiUser className="field-icon" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="field-input"
                  placeholder="0550000000"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="field-wrap">
                <HiLockClosed className="field-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="field-input"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={10}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="strength-bar">
                  <div
                    className={`strength-fill ${
                      form.password.length < 6
                        ? "weak"
                        : form.password.length < 10
                        ? "medium"
                        : "strong"
                    }`}
                  />
                  <span className="strength-label">
                    {form.password.length < 6
                      ? "Weak"
                      : form.password.length < 10
                      ? "Medium"
                      : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="confirm_password">
                Confirm Password
              </label>
              <div className="field-wrap">
                <HiLockClosed className="field-icon" />
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  className="field-input"
                  placeholder="Confirm your password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                  minLength={10}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`submit-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : "Create Account"}
            </button>
          </form>

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">or</span>
            <span className="divider-line" />
          </div>

          <p className="login-prompt">
            Already have an account?{" "}
            <Link to="/login" className="login-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}