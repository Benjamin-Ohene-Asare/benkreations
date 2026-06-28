import axios from "axios";
import api from "./api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/* CATEGORY API CALLS */

export const getCategories = () => {
  return axios.get(`${API_BASE_URL}/api/store/categories/`);
};

export const getProducts = () => {
  return axios.get(`${API_BASE_URL}/api/store/products/`);
};

export const createCategory = (categoryData) => {
  return api.post("/store/categories/", categoryData);
};

export const updateCategory = (categoryId, categoryData) => {
  return api.put(`/store/categories/${categoryId}/`, categoryData);
};

export const deleteCategory = (categoryId) => {
  return api.delete(`/store/categories/${categoryId}/`);
};


/* PRODUCT API CALLS */


export const createProduct = (productData) => {
  return api.post("/store/products/", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = (productId, productData) => {
  return api.put(`/store/products/${productId}/`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (productId) => {
  return api.delete(`/store/products/${productId}/`);
};

export const getFeaturedProducts = () => {
  return axios.get(`${API_BASE_URL}/api/store/products/?featured=true`);
};
export const getProduct = (productId) => {
  return axios.get(`${API_BASE_URL}/api/store/products/${productId}/`);
};