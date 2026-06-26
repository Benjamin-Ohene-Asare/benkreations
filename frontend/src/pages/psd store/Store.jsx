import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, getProducts } from "../../services/storeApi";
import { addToCart } from "../../services/cartApi";
import "./Store.css";

const Store = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([
    {
      id: "all",
      label: "All Templates",
      products_count: 0,
    },
  ]);

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStore = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const [categoryRes, productRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        const categoryData = categoryRes.data;
        const productData = productRes.data;

        if (!isMounted) return;

        const cleanCategories = categoryData
          .filter((category) => category.status === "active")
          .map((category) => ({
            id: category.id,
            label: category.name,
            slug: category.slug,
            products_count: category.products_count || 0,
          }));

        setCategories([
          {
            id: "all",
            label: "All Templates",
            products_count: productData.length,
          },
          ...cleanCategories,
        ]);

        setProducts(productData);
      } catch (err) {
        if (isMounted) {
          setLoadError(
            "Couldn't load templates right now. Please refresh to try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStore();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = async (product) => {
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        Number(product.category) === Number(activeCategory);

      const matchesSearch = product.title
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const clearFilters = () => {
    setActiveCategory("all");
    setSearchTerm("");
  };

  return (
    <div className="store__wrapper">
      <section className="store__hero">
        <span className="store__heroDots" aria-hidden="true" />
        <span className="store__heroGlow" aria-hidden="true" />
        <span className="store__heroRing" aria-hidden="true" />

        <div className="store__heroContent">
          <p className="store__eyebrow">
            Templates made for the moments that matter
          </p>

          <h1 className="store__heroTitle">
            Design help for churches, NGOs
            <br />
            and small businesses
          </h1>

          <p className="store__heroSub">
            Editable flyer templates built around how ministries, NGOs and
            small teams actually communicate — ready in minutes, not days.
          </p>

          <div className="store__heroActions">
            <button
              type="button"
              className="store__cta store__cta--primary"
              onClick={() => setActiveCategory("all")}
            >
              Browse all templates
            </button>

            <button type="button" className="store__cta store__cta--ghost">
              Request a custom design
            </button>
          </div>
        </div>
      </section>

      <div className="store__toolbar">
        <label className="store__search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates"
          />
        </label>

        <p className="store__count">
          {isLoading
            ? "Loading..."
            : `${filteredProducts.length} template${
                filteredProducts.length === 1 ? "" : "s"
              } found`}
        </p>
      </div>

      <div className="store__layout">
        <nav
          className="store__categories"
          aria-label="Filter templates by category"
        >
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  className={activeCategory === category.id ? "is-active" : ""}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.label}</span>

                  {category.id !== "all" && (
                    <small>{category.products_count}</small>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="store__gridArea">
          {loadError ? (
            <div className="store__empty">
              <p className="store__emptyTitle">Something went wrong.</p>
              <p className="store__emptyBody">{loadError}</p>
            </div>
          ) : isLoading ? (
            <div className="store__grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="store__card store__card--skeleton"
                  aria-hidden="true"
                >
                  <div className="store__thumb store__thumb--skeleton" />

                  <div className="store__cardBody">
                    <div className="store__skeletonLine store__skeletonLine--short" />
                    <div className="store__skeletonLine" />
                    <div className="store__skeletonLine store__skeletonLine--long" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="store__empty">
              <p className="store__emptyTitle">
                No templates match that search.
              </p>

              <p className="store__emptyBody">
                Try a different keyword, or clear your filters to see
                everything.
              </p>

              <button
                type="button"
                className="store__cta store__cta--primary"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="store__grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="store__card">
                  <div className="store__thumb">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="store__productImage"
                      />
                    ) : (
                      <div className="store__thumbPlaceholder">
                        PSD Template
                      </div>
                    )}

                    <span className="store__tag">
                      ₵{Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="store__cardBody">
                    <p className="store__cardEyebrow">
                      {product.category_name}
                    </p>

                    <h3 className="store__cardTitle">{product.title}</h3>

                    <p className="store__cardBlurb">
                      {product.short_description}
                    </p>
                  </div>

                  <div className="store__cardActions">
                    <button
                      type="button"
                      className="store__cta store__cta--primary store__cta--small"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to cart
                    </button>

                    <button
                      type="button"
                      className="store__cta store__cta--ghost store__cta--small"
                    >
                      View
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;