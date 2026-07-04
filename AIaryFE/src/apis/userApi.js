import api from "../util/api";

export const createUserApi = async (userData) => {
  try {
    const response = await api.post("/user", userData);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};
