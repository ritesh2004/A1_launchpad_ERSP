import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const submitRequest = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/repair-requests/create`, formData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting request:", error);
        return { error: error.response ? error.response.data : "An error occurred while submitting the request" };
    }
};
