import axios from "../assets/axios.js";
import jwtDecode from "jwt-decode";

export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await apiClient.post("/auth/login", userData);
  const { token } = response.data;
  localStorage.setItem("token", token);
  return response.data;
};

export const getUserData = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
