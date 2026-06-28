import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { getFeaturedProducts } from "../../services/storeApi";
import "./catalog.css";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/cartApi";
import { Link } from "react-router-dom";
const Catalog = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2500);
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getFeaturedProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  const navigate = useNavigate();
  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id);
      showToast("Product added to cart.");
    } catch (err) {
      showToast("Failed to add product.", "error");
    }
  };
  return (
    <section className="catalog">
      <div className="catalog-inner">
        <div className="catalog-header">
          <p className="catalog-eyebrow">PSD Store</p>
          <h2>Ready-Made Design Templates</h2>
          <p className="catalog-subtitle">
            Editable flyer and social media templates, designed for fast
            customization.
          </p>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No featured products yet.</p>
        ) : (
          <div className="catalog-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                  />
                </div>

                <div className="product-body">
                  <p className="product-category">{product.category_name}</p>

                  <h3 className="product-title">{product.title}</h3>

                  <p className="product-price">
                    ₵{Number(product.price).toFixed(2)}
                  </p>

                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

     <div className="more-bitton">
                <button> 

                      <Link to="/psd-store" className="">
                  View More
                </Link>
                </button>

              
            </div>

      {toast.show && (
        <div className={`catalog-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default Catalog;