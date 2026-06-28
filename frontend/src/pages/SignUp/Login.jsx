import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import api from "../../services/api";
import "./signup.css";

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

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

        return "Login failed.";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
  const res = await api.post("/account/login/", form);

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  window.dispatchEvent(new Event("authChange"));

  setSuccess("Login successful.");

  setTimeout(() => {
    if (res.data.user?.role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate("/user-dashboard", { replace: true });
    }
  }, 800);
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

                    <h1 className="brand-title">Welcome back</h1>

                    <p className="brand-tagline">
                        Sign in to access your library, orders and account settings.
                    </p>

                    <div className="brand-dots">
                        <span className="dot" />
                        <span className="dot active" />
                        <span className="dot" />
                    </div>
                </div>
            </div>

            <div className="signup-right">
                <div className="form-card">

                    <div className="form-top">
                        <h2 className="form-title">Log in to your account</h2>
                        <p className="form-subtitle">
                            Good to see you again
                        </p>
                    </div>

                    {error && (
                        <p className="form-error">{error}</p>
                    )}

                    {success && (
                        <p className="form-success">{success}</p>
                    )}

                    <form
                        className="signup-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="field-group">
                            <label
                                className="field-label"
                                htmlFor="email"
                            >
                                Email Address
                            </label>

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
                                />
                            </div>
                        </div>

                        <div className="field-group">
                            <div className="label-row">
                                <label
                                    className="field-label"
                                    htmlFor="password"
                                >
                                    Password
                                </label>

                               <Link to="/forgot-password">
    Forgot password?
</Link>
                            </div>

                            <div className="field-wrap">
                                <HiLockClosed className="field-icon" />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="field-input"
                                    placeholder="Your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <HiEyeOff />
                                    ) : (
                                        <HiEye />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn ${loading ? "loading" : ""
                                }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner" />
                            ) : (
                                "Log In"
                            )}
                        </button>

                    </form>

                    <div className="divider">
                        <span className="divider-line" />
                        <span className="divider-text">or</span>
                        <span className="divider-line" />
                    </div>

                    <p className="login-prompt">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="login-link"
                        >
                            Sign up free
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;