import { expect, test } from 'vitest';
import {
  padZero,
  formatHoursMinutes,
  getDateFromFullTime,
  getHoursFromFullTime,
  get24Hours
} from '@/utils';

test('Pad zero.', () => {
  expect(padZero(1)).toBe('01');
  expect(padZero(12)).toBe(12);
});

test('Convert time to "HH:MM" format', () => {
  expect(formatHoursMinutes('9:30 AM')).toBe('09:30');
  expect(formatHoursMinutes('12:00 AM')).toBe('00:00');
  expect(formatHoursMinutes('9:30 PM')).toBe('21:30');
  expect(formatHoursMinutes('12:00 PM')).toBe('12:00');
});

test('Get date from full time.', () => {
  expect(getDateFromFullTime('2024-01-01 00:00')).toBe(1);
  expect(getDateFromFullTime('2024-01-10 00:00')).toBe(10);
  expect(getDateFromFullTime('2024-01-20 00:00')).toBe(20);
});

test('Get hours from full time.', () => {
  expect(getHoursFromFullTime('2024-01-01 00:00')).toBe(0);
  expect(getHoursFromFullTime('2024-01-01 01:00')).toBe(1);
  expect(getHoursFromFullTime('2024-01-01 10:00')).toBe(10);
  expect(getHoursFromFullTime('2024-01-01 23:00')).toBe(23);
});

test('Convert hours to 24 hours format.', () => {
  expect(get24Hours('12:00 AM')).toBe(0);
  expect(get24Hours('9:30 AM')).toBe(9);
  expect(get24Hours('12:00 PM')).toBe(12);
  expect(get24Hours('9:30 PM')).toBe(21);
});
