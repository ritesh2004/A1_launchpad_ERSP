import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const getProfile = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/users/profile`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { error: error.response ? error.response.data : "An error occurred while fetching the profile" };
  }
}