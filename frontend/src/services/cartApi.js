import api from "./api";

export const getCart = () => {
  return api.get("/store/cart/");
};

export const addToCart = (productId) => {
  return api.post("/store/cart/add/", {
    product_id: productId,
  });
};

export const removeFromCart = (itemId) => {
  return api.delete(`/store/cart/remove/${itemId}/`);
};

export const clearCart = () => {
  return api.delete("/store/cart/clear/");
};