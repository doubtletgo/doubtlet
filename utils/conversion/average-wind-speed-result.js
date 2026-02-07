import data from '../constants/average-wind-speed.json';

export function findAverageWindSpeed(duration, difference) {
  const values = data[duration];
  const vals = values?.find(
    (val) => val.FROM <= difference && val.TO >= difference
  );

  return {
    kmph: vals?.KMPH ?? 'N/A',
    knots: vals?.KNOTS ?? 'N/A',
  };
}

export default findAverageWindSpeed;
