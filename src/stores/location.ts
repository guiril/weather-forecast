import { defineStore } from 'pinia';
import { getLocalLocationAPI } from '@/utils/axios';

interface StateType {
  localLocation: string | null;
}

export const useLocationStore = defineStore('location', {
  state: (): StateType => ({
    localLocation: null
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
      this.localLocation = null;
    }
  }
});
