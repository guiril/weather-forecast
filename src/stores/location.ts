import { defineStore } from 'pinia';
import { getLocalLocationAPI } from '@/utils/axios';

interface StateType {
  localLocation: string;
}

export const useLocationStore = defineStore('location', {
  state: (): StateType => ({
    localLocation: ''
  }),
  actions: {
    async getLocalLocation() {
      try {
        const data = await getLocalLocationAPI();
        this.localLocation = data.city.name;
      } catch (err) {
        console.error(err);
      }
    },
    resetLocalLocation() {
      if (!this.localLocation) return;
      this.localLocation = '';
    }
  }
});
