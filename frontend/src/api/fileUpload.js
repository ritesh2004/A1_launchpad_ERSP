import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";


export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post(`${API_URL}/files/upload`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        return { error: error.response ? error.response.data : "An error occurred while uploading the file" };
    }
};
