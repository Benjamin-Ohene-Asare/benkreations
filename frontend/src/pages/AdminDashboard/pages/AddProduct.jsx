import { useEffect, useState } from "react";
import {
  HiPhotograph,
  HiArchive,
  HiDocumentAdd,
  HiSave,
} from "react-icons/hi";
import { createProduct, getCategories } from "../../../services/storeApi";
import "./AddProduct.css";

const AddProduct = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    tags: "",
    status: "draft",
  });

  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [psdFile, setPsdFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getBackendError = (err) => {
    const data = err.response?.data;

    if (!data) return "Something went wrong. Please try again.";

    if (typeof data === "string") return data;

    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];

    if (Array.isArray(firstValue)) {
      return `${firstKey}: ${firstValue[0]}`;
    }

    if (typeof firstValue === "string") {
      return `${firstKey}: ${firstValue}`;
    }

    return "Failed to upload product.";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);

      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        setError("Failed to load categories.");
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handlePreviewImages = (e) => {
    setPreviewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const productData = new FormData();

      productData.append("title", form.title);
      productData.append("category", form.category);
      productData.append("short_description", form.shortDescription);
      productData.append("full_description", form.fullDescription);
      productData.append("price", form.price);
      productData.append("tags", form.tags);
      productData.append("status", form.status);

      if (thumbnail) {
        productData.append("thumbnail", thumbnail);
      }

      previewImages.forEach((image) => {
        productData.append("uploaded_preview_images", image);
      });

      if (psdFile) {
        productData.append("psd_file", psdFile);
      }

      if (zipFile) {
        productData.append("zip_file", zipFile);
      }

      await createProduct(productData);

      setSuccess("Product uploaded successfully.");

      setForm({
        title: "",
        category: "",
        shortDescription: "",
        fullDescription: "",
        price: "",
        tags: "",
        status: "draft",
      });

      setThumbnail(null);
      setPreviewImages([]);
      setPsdFile(null);
      setZipFile(null);
    } catch (err) {
      setError(getBackendError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <div>
          <h1>Upload PSD Product</h1>
          <p>Create a new PSD product and upload all required files.</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <h2>Product Information</h2>

          <div className="form-grid">
            <div className="form-group full">
              <label>Product Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Church Flyer PSD Template"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  {fetchingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group full">
              <label>Short Description</label>
              <input
                type="text"
                name="shortDescription"
                placeholder="Brief product summary"
                value={form.shortDescription}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full">
              <label>Full Description</label>
              <textarea
                name="fullDescription"
                placeholder="Describe what is inside the PSD file..."
                value={form.fullDescription}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <div className="form-group full">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="church, flyer, event, psd"
                value={form.tags}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2>Product Files</h2>

          <div className="upload-grid">
            <label className="upload-box">
              <HiPhotograph />
              <h3>Thumbnail</h3>
              <p>Upload the main product thumbnail</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                required
              />
            </label>

            <label className="upload-box">
              <HiPhotograph />
              <h3>Preview Images</h3>
              <p>Upload one or more preview images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePreviewImages}
                required
              />
            </label>

            <label className="upload-box">
              <HiDocumentAdd />
              <h3>PSD File</h3>
              <p>Upload the main editable PSD file</p>
              <input
                type="file"
                accept=".psd"
                onChange={(e) => setPsdFile(e.target.files[0])}
                required
              />
            </label>

            <label className="upload-box">
              <HiArchive />
              <h3>ZIP File Optional</h3>
              <p>Upload extra files, fonts, or documentation</p>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setZipFile(e.target.files[0])}
              />
            </label>
          </div>

          <div className="file-preview-list">
            {thumbnail && <p>Thumbnail selected: {thumbnail.name}</p>}

            {previewImages.length > 0 && (
              <p>{previewImages.length} preview image(s) selected</p>
            )}

            {psdFile && <p>PSD selected: {psdFile.name}</p>}
            {zipFile && <p>ZIP selected: {zipFile.name}</p>}
          </div>
        </div>

        <div className="form-card">
          <h2>Publishing</h2>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Save as Draft</option>
              <option value="published">Publish Now</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              <HiSave />
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;