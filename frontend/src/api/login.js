import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const login = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}/users/login`, credentials, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    return { error: error.response ? error.response.data : "An error occurred during login" };
  }
};
