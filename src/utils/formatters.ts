export const padZero = (number: number) =>
  number < 10 ? `0${number}` : number;

export const formatHoursMinutes = (time: string) => {
  // time: HH:MM AM, HH:MM PM
  const [timePart, _period] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  hours = get24Hours(time);

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
  const [timePart, period] = time.split(' ');
  const hours = timePart.split(':').map(Number)[0];

  return hours === 12
    ? period === 'AM'
      ? 0
      : 12
    : period === 'PM'
    ? hours + 12
    : hours;
};
