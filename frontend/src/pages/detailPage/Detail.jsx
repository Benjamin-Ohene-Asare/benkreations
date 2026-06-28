import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../../services/storeApi";
import { addToCart } from "../../services/cartApi";
import "./Detail.css";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch (err) {
        console.log("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await addToCart(product.id);
      alert("Product added to cart.");
    } catch (err) {
      alert("Failed to add product.");
    }
  };

  if (loading) return <div className="detail-page">Loading product...</div>;

  if (!product) return <div className="detail-page">Product not found.</div>;

  return (
    <div className="detail-page">
      <div className="detail-img">
        <img src={product.thumbnail} alt={product.title} />
      </div>

      <div className="detail-info">
        <span className="detail-info__badge">
          {product.category_name}
        </span>

        <h1>{product.title}</h1>

        <div className="detail-info__rating">
          <span className="detail-info__stars">★★★★★</span>
          <span className="detail-info__rating-text">Premium Template</span>
        </div>

        <p className="detail-info__desc">
          {product.full_description || product.short_description}
        </p>

        <div className="detail-info__included">
          <h3>What's Included:</h3>
          <ul className="detail-info__included-list">
            <li>Editable PSD file</li>
            <li>Instant digital download</li>
            <li>High-resolution design</li>
            <li>Ready for customization</li>
          </ul>
        </div>

        <div className="detail-info__price">
          <span className="detail-info__price-amount">
            ₵{Number(product.price).toFixed(2)}
          </span>
          <span className="detail-info__price-label">one-time purchase</span>
        </div>

        <button className="detail-info__btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Detail;