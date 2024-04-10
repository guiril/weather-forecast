import { defineStore } from 'pinia';
import { getForecasetAPI } from '@/utils/axios';
import {
  formatHoursMinutes,
  getDateFromFullTime,
  getHoursFromFullTime,
  get24Hours
} from '@/utils/formatters';

const HISTORY_LIST_KEY = 'searchHistoryList';

const searchHistoryList: { location: string }[] = JSON.parse(
  localStorage.getItem(HISTORY_LIST_KEY) || '[]'
);

interface StateType {
  isLoading: boolean;
  errorMessage: string | null;
  searchingLocation: string | null;
  localTime: string | null;
  localDate: number | null;
  localHours: number | null;
  dailyForecasts: any[];
  hourlyForecasts: any[];
}

export const useForecastsStore = defineStore('forecasts', {
  state: (): StateType => ({
    isLoading: false,
    errorMessage: null,
    searchingLocation: null,
    localTime: null,
    localDate: null,
    localHours: null,
    dailyForecasts: [],
    hourlyForecasts: []
  }),
  actions: {
    async getForecasts(location: string | string[]) {
      try {
        this.isLoading = true;

        const data = await getForecasetAPI(location);

        if (data.message) {
          this.errorMessage = data.message;
          this.isLoading = false;
          throw new Error(data.message);
        }
        this.searchingLocation = data.location.name;
        this.localTime = data.location.localtime;
        this.dailyForecasts = [...data.forecast.forecastday];

        this.getCurrentDate();
        this.getCurrentHours();

        this.getHourlyWeather();
        this.addToHistoryList();

        this.errorMessage = null;
        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    getCurrentDate() {
      if (!this.localTime) return;
      this.localDate = getDateFromFullTime(this.localTime);
    },
    getCurrentHours() {
      if (!this.localTime) return;
      this.localHours = getHoursFromFullTime(this.localTime);
    },
    getHourlyWeather() {
      this.resetHourlyForecasts();
      this.getTodayWeather();
      this.getTomorrowWeather();
    },
    resetHourlyForecasts() {
      this.hourlyForecasts = [];
    },
    getTodayWeather() {
      const forecast = this.dailyForecasts[0];
      const sunriseTime = forecast.astro.sunrise;
      const sunriseHours = get24Hours(sunriseTime);
      const sunsetTime = forecast.astro.sunset;
      const sunsetHours = get24Hours(sunsetTime);

      forecast.hour.forEach((weather: any, index: number) => {
        const weatherHours = getHoursFromFullTime(weather.time);

        if (!this.localHours) return;

        if (index >= this.localHours) {
          this.hourlyForecasts.push(weather);
        }

        if (sunriseHours >= this.localHours && sunriseHours === weatherHours) {
          this.hourlyForecasts.push({
            title: 'Sunrise',
            time: formatHoursMinutes(sunriseTime)
          });
        }

        if (sunsetHours >= this.localHours && sunsetHours === weatherHours) {
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

        if (!this.localHours) return;

        if (index <= this.localHours) {
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
            item.location === this.searchingLocation
        ) === -1;

      if (isLocationNotFound && this.searchingLocation) {
        searchHistoryList.push({
          location: this.searchingLocation
        });

        localStorage.setItem(
          HISTORY_LIST_KEY,
          JSON.stringify(searchHistoryList)
        );
      }
    }
  }
});
