import { describe, test, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';

import SearchHistory from '@/components/search/SearchHistory.vue';

const HISTORY_LIST_KEY = 'searchHistoryList';

describe('show or hide clear button', () => {
  beforeEach(() => {
    const mockList = [{ location: 'example location' }];

    localStorage.setItem(HISTORY_LIST_KEY, JSON.stringify(mockList));

    return () => {
      localStorage.removeItem(HISTORY_LIST_KEY);
    };
  });

  test('show clear button', () => {
    const wrapper = mount(SearchHistory);
    const button = wrapper.find('[data-button="clear"]');

    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Clear All History');
  });

  test('hide clear button', () => {
    localStorage.removeItem('searchHistoryList');

    const wrapper = mount(SearchHistory);
    const button = wrapper.find('[data-button="clear"]');

    expect(button.exists()).toBe(false);
  });
});
