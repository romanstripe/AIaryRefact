import api from "../util/api";

export const loginWithEmailApi = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

export const loginWithGoogleApi = async ({ token }) => {
  try {
    const response = await api.post("/auth/google", { token });
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};
