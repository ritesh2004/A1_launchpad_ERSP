import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const signup = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/users/signup`, userData);
    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    return { error: error.response ? error.response.data : 'An error occurred during signup' };
  }
}