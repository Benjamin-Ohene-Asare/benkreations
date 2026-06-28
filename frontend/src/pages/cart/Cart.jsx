import React, { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  clearCart,
} from "../../services/cartApi";
import { initializePayment } from "../../services/paymentApi";
import "./cart.css";
export default function Cart() {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setItems(res.data.items || []);
      setTotalAmount(Number(res.data.total_amount || 0));
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (itemId) => {
    const res = await removeFromCart(itemId);
    setItems(res.data.items || []);
    setTotalAmount(Number(res.data.total_amount || 0));
  };

  const handleClearCart = async () => {
    const res = await clearCart();
    setItems(res.data.items || []);
    setTotalAmount(Number(res.data.total_amount || 0));
  };
const handleCheckout = async () => {
  try {
    const res = await initializePayment();
    window.location.href = res.data.authorization_url;
  } catch (err) {
    alert("Could not start payment. Please try again.");
  }
};
  if (loading) {
    return <p>Loading cart...</p>;
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
      </div>

      <div className="cart-body">
        <div className="cart-left">
          <div className="cart-table-wrap">
            {items.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon">🛒</span>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="table-head">
                  <span className="col-product">Product</span>
                  <span className="col-price">Price</span>
                  <span className="col-sub">Subtotal</span>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="cart-row">
                    <div className="col-product product-cell">
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.id)}
                      >
                        ×
                      </button>

                      <div className="product-image">
                        <img src={item.thumbnail} alt={item.title} />
                      </div>

                      <div className="product-info">
                        <span className="product-name">{item.title}</span>
                        <span className="product-weight">
                          {item.category_name}
                        </span>
                      </div>
                    </div>

                    <div className="col-price price-cell">
                      ₵{Number(item.price).toFixed(2)}
                    </div>

                    <div className="col-sub subtotal-cell">
                      ₵{Number(item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {items.length > 0 && (
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={handleClearCart}>
                Clear Shopping Cart
              </button>
            </div>
          )}
        </div>

        <aside className="order-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Items</span>
              <span>{items.length}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₵{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <span>₵{totalAmount.toFixed(2)}</span>
          </div>

         <button
  className="checkout-btn"
  disabled={items.length === 0}
  onClick={handleCheckout}
>
  Proceed to Checkout
</button>
        </aside>
      </div>
    </div>
  );
}