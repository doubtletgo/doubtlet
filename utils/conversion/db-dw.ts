import rhData from '../constants/rh-db-dw.json';
import vpData from '../constants/vp-db-dw.json';

export const getRh = (db: string, dw: string) => {
  return rhData?.[parseFloat(db)]?.[parseFloat(dw)] || '';
};

export const getVp = (db: string, dw: string) => {
  return vpData?.[parseFloat(db)]?.[parseFloat(dw)] || '';
};
