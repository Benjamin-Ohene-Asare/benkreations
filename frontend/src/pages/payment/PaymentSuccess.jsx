import React, { useEffect, useState } from "react";
import {
  verifyPayment,
  getOrderDownloads,
} from "../../services/paymentApi";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [orderId, setOrderId] = useState(null);
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");

      if (!reference) {
        setStatus("failed");
        setMessage("No payment reference found.");
        return;
      }

      try {
        const res = await verifyPayment(reference);

        setStatus("success");
        setMessage(res.data.message || "Payment verified successfully.");

        const id = res.data.order_id;
        setOrderId(id);

        const downloadRes = await getOrderDownloads(id);
        setDownloads(downloadRes.data.downloads || []);
      } catch (err) {
        setStatus("failed");
        setMessage("Payment verification failed. Please contact support.");
      }
    };

    verify();
  }, []);

  if (status === "verifying") {
    return (
      <div className="ps-wrap">
        <div className="ps-verifying">
          <p>Verifying your payment…</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="ps-wrap">
        <div className="ps-hero">
          <div className="ps-icon-ring-failed">
            <span className="ps-icon-failed">✕</span>
          </div>
          <h1 className="ps-h1">Payment failed</h1>
          <p className="ps-sub">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-wrap">
      <div className="ps-hero">
        <div className="ps-icon-ring">
          <span className="ps-icon-success">✓</span>
        </div>
        <h1 className="ps-h1">Payment successful</h1>
        <p className="ps-sub">{message}</p>
        {orderId && (
          <div className="ps-meta-badge">
            Order ID <span className="ps-meta-id">#{orderId}</span>
          </div>
        )}
      </div>

      {downloads.length > 0 && (
        <div className="ps-grid">
          {downloads.map((item) => (
            <div key={item.product_id} className="ps-card">
              <div className="ps-card-header">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="ps-thumb"
                  />
                ) : (
                  <div className="ps-thumb-placeholder" />
                )}
                <div>
                  <h3 className="ps-card-title">{item.title}</h3>
                  <p className="ps-card-subtitle">
                    Your purchase is ready to download
                  </p>
                </div>
              </div>

              <hr className="ps-divider" />

              <div className="ps-btns">
                {item.psd_file && (
                  <a
                    href={item.psd_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ps-btn"
                  >
                    ↓ Download PSD
                  </a>
                )}

                {item.zip_file && (
                  <a
                    href={item.zip_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ps-btn"
                  >
                    ↓ Download ZIP
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;