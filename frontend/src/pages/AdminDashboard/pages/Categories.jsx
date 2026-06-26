import { useEffect, useState } from "react";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../../services/storeApi";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      setFetching(true);
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
      ...(name === "name" && { slug: generateSlug(value) }),
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await createCategory(form);

      setSuccess("Category created successfully.");

      setForm({
        name: "",
        slug: "",
        description: "",
        status: "active",
      });

      fetchCategories();
    } catch (err) {
      const backendError =
        err.response?.data?.name?.[0] ||
        err.response?.data?.slug?.[0] ||
        err.response?.data?.detail ||
        "Failed to create category.";

      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await deleteCategory(id);

      setSuccess("Category deleted successfully.");
      fetchCategories();
    } catch (err) {
      const backendError =
        err.response?.data?.detail || "Failed to delete category.";

      setError(backendError);
    }
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Create and manage PSD store categories.</p>
        </div>
      </div>

      {(error || success) && (
        <div className={error ? "alert error" : "alert success"}>
          {error || success}
        </div>
      )}

      <div className="categories-layout">
        <form className="category-form-card" onSubmit={handleSubmit}>
          <h2>Create Category</h2>

          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Church Flyers"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              placeholder="church-flyers"
              value={form.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description Optional</label>
            <textarea
              name="description"
              placeholder="Short description for this category"
              value={form.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="create-category-btn" disabled={loading}>
            <HiPlus />
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>

        <div className="categories-table-card">
          <div className="section-header">
            <h2>All Categories</h2>
            <span>{categories.length} categories</span>
          </div>

          {fetching ? (
            <div className="empty-state">
              <h3>Loading categories...</h3>
              <p>Please wait.</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <h3>No categories yet</h3>
              <p>Your PSD store categories will appear here.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td>{category.products_count || 0}</td>
                      <td>
                        <span className={`status-badge ${category.status}`}>
                          {category.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="edit-btn">
                            <HiPencil />
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(category.id)}
                          >
                            <HiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;