import { useState } from "react";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/accountApi";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await forgotPassword(email);

      setMessage(
        res.data.message ||
          "If an account exists with that email, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-logo">B</div>

        <h1>Forgot Password?</h1>

        <p>
          Enter the email address associated with your account and we'll send
          you a password reset link.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>RESET PASSWORD</h2>

          <p className="auth-subtitle">
            Enter your registered email below.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>

            <div className="input-group">
              <HiMail className="input-icon" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <div className="auth-footer">
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;