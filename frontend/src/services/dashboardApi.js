import api from "./api";

export const getCustomerDashboard = () => {
  return api.get("/store/dashboard/");
};