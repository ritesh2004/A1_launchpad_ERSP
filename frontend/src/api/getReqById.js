import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const getReqById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/repair-requests/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching request by ID:", error);
    if (error.response && error.response.data) {
      return { error: error.response.data.message || "Failed to fetch request" };
    }
    return { error: "Failed to fetch request" };
  }
};
