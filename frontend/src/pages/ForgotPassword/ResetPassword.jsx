import { useState } from "react";
import { HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/accountApi";
import "./ForgotPassword.css";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await resetPassword(uid, token, {
        password,
        confirm_password: confirmPassword,
      });

      setMessage(
        res.data.message || "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Reset link is invalid or has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-logo">B</div>

        <h1>Create New Password</h1>

        <p>
          Choose a strong password for your account.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>RESET PASSWORD</h2>

          <p className="auth-subtitle">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit}>
            <label>New Password</label>

            <div className="input-group">
              <HiLockClosed className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            <label>Confirm Password</label>

            <div className="input-group">
              <HiLockClosed className="input-icon" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <HiEyeOff />
                ) : (
                  <HiEye />
                )}
              </button>
            </div>

            <button
              className="auth-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          {message && (
            <p className="auth-message">{message}</p>
          )}

          <div className="auth-footer">
            <Link to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;