import axios from 'axios';

const weatherInstance = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json'
  }
});

export const weatherAPIGet = async (url: string) => {
  try {
    const response = await weatherInstance.get(url);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
