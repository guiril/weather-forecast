import { defineStore } from 'pinia';
import {
  formatHoursMinutes,
  getDateFromFullTime,
  getHoursFromFullTime,
  get24Hours
} from '@/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HISTORY_LIST_KEY = 'searchHistoryList';

const searchHistoryList: { location: string }[] = JSON.parse(
  localStorage.getItem(HISTORY_LIST_KEY) || '[]'
);

interface StateType {
  isLoading: boolean;
  errorMessage: string | null;
  currentDate: number | null;
  currentHours: number | null;
  current: CurrentType;
  dailyForecasts: any[];
  hourlyForecasts: any[];
}

interface CurrentType {
  location: string | null;
  temp: number | null;
  condition: string | null;
  minTemp: number | null;
  maxTemp: number | null;
}

export const useForecastsStore = defineStore('forecasts', {
  state: (): StateType => ({
    isLoading: false,
    errorMessage: null,
    currentDate: null,
    currentHours: null,
    current: {
      location: null,
      temp: null,
      condition: null,
      minTemp: null,
      maxTemp: null
    },
    dailyForecasts: [],
    hourlyForecasts: []
  }),
  actions: {
    async getLocalTime(location: string | string[]) {
      try {
        const response = await (
          await fetch(`${API_BASE_URL}/current/${location}`)
        ).json();

        if (response.message) {
          throw new Error(response.message);
        }

        const localtime = response.location.localtime;
        this.currentDate = getDateFromFullTime(localtime);
        this.currentHours = getHoursFromFullTime(localtime);
      } catch (err) {
        console.error(err);
      }
    },
    async getAllForecasts(location: string | string[]) {
      try {
        this.isLoading = true;

        const response = await (
          await fetch(`${API_BASE_URL}/forecast/${location}`)
        ).json();

        if (response.message) {
          this.errorMessage = response.message;
          this.isLoading = false;
          throw new Error(response.message);
        }

        this.current.location = response.location.name;
        this.current.temp = response.current.temp_c;
        this.current.condition = response.current.condition.text;
        this.current.minTemp = response.forecast.forecastday[0].day.mintemp_c;
        this.current.maxTemp = response.forecast.forecastday[0].day.maxtemp_c;
        this.dailyForecasts = [...response.forecast.forecastday];

        this.getHourlyWeather();
        this.addToHistoryList();

        this.errorMessage = null;
        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    getHourlyWeather() {
      this.hourlyForecasts = []; // remove previous value
      this.getTodayWeather();
      this.getTomorrowWeather();
    },
    getTodayWeather() {
      const forecast = this.dailyForecasts[0];
      const sunriseTime = forecast.astro.sunrise;
      const sunriseHours = get24Hours(sunriseTime);
      const sunsetTime = forecast.astro.sunset;
      const sunsetHours = get24Hours(sunsetTime);

      forecast.hour.forEach((weather: any, index: number) => {
        const weatherHours = getHoursFromFullTime(weather.time);

        if (!this.currentHours) return;

        if (index >= this.currentHours) {
          this.hourlyForecasts.push(weather);
        }

        if (
          sunriseHours >= this.currentHours &&
          sunriseHours === weatherHours
        ) {
          this.hourlyForecasts.push({
            title: 'Sunrise',
            time: formatHoursMinutes(sunriseTime)
          });
        }

        if (sunsetHours >= this.currentHours && sunsetHours === weatherHours) {
          this.hourlyForecasts.push({
            title: 'Sunset',
            time: formatHoursMinutes(sunsetTime)
          });
        }
      });
    },
    getTomorrowWeather() {
      const forecast = this.dailyForecasts[1];
      const sunriseTime = forecast.astro.sunrise;
      const sunriseHours = get24Hours(sunriseTime);
      const sunsetTime = forecast.astro.sunset;
      const sunsetHours = get24Hours(sunsetTime);

      forecast.hour.forEach((weather: any, index: number) => {
        const weatherHours = getHoursFromFullTime(weather.time);

        if (!this.currentHours) return;

        if (index <= this.currentHours) {
          this.hourlyForecasts.push(weather);

          if (sunriseHours === weatherHours) {
            this.hourlyForecasts.push({
              title: 'Sunrise',
              time: formatHoursMinutes(sunriseTime)
            });
          }

          if (sunsetHours === weatherHours) {
            this.hourlyForecasts.push({
              title: 'Sunset',
              time: formatHoursMinutes(sunsetTime)
            });
          }
        }
      });
    },
    addToHistoryList() {
      const isLocationNotFound =
        searchHistoryList.findIndex(
          (item: { location: string }) =>
            item.location === this.current.location
        ) === -1;

      if (isLocationNotFound && this.current.location) {
        searchHistoryList.push({
          location: this.current.location
        });

        localStorage.setItem(
          HISTORY_LIST_KEY,
          JSON.stringify(searchHistoryList)
        );
      }
    }
  }
});
