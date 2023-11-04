const padZero = (number: number) => (number < 10 ? `0${number}` : number);

export const formatHoursMinutes = (time: string) => {
  // time: HH:MM AM, HH:MM PM
  const hours = get24Hours(time);
  const minutes = Number(time.split(' ')[0].split(':')[1]);

  return `${padZero(hours)}:${padZero(minutes)}`;
};

export const getDateFromFullTime = (
  time: string // time: YYYY-MM-DD HH:MM
) => parseInt(time.split(' ')[0].split('-')[2], 10);

export const getHoursFromFullTime = (
  time: string // time: YYYY-MM-DD HH:MM
) => parseInt(time.split(' ')[1].split(':')[0], 10);

export const get24Hours = (time: string) => {
  // time: HH:MM AM, HH:MM PM
  const amPm = time.split(' ')[1];
  const hours = Number(time.split(' ')[0].split(':')[0]);

  return amPm === 'PM' ? hours + 12 : hours;
};
