import api from "./api";

export const changePassword = (data) => {
  return api.post("/account/change-password/", data);
};

export const forgotPassword = (email) =>
    api.post("/account/forgot-password/", {
        email,
    });

export const resetPassword = (uid, token, data) =>
    api.post(`/account/reset-password/${uid}/${token}/`, data);