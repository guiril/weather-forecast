import axios from 'axios';

const WEATHER_API_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL;
const LOCATION_API_KEY = import.meta.env.VITE_LOCATION_API_KEY;
const LOCATION_API_BASE_URL = import.meta.env.VITE_LOCATION_API_BASE_URL;

const weatherInstance = axios.create({
  baseURL: WEATHER_API_BASE_URL
});

const locationInstance = axios.create({
  baseURL: LOCATION_API_BASE_URL
});

export const getCurrentWeatherAPI = async (location: string) => {
  try {
    const response = await weatherInstance.get(`/current/${location}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getForecasetAPI = async (location: string | string[]) => {
  try {
    const response = await weatherInstance.get(`/forecast/${location}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getLocalLocationAPI = async () => {
  try {
    const response = await locationInstance.get(
      `/ipinfo?&apiKey=${LOCATION_API_KEY}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
