import api from "./api";

export const initializePayment = () => {
  return api.post("/store/payments/initialize/");
};

export const verifyPayment = (reference) => {
  return api.get(`/store/payments/verify/?reference=${reference}`);
};

export const getOrderDownloads = (orderId) => {
  return api.get(`/store/orders/${orderId}/downloads/`);
};