import Cookies from 'js-cookie';
import {setAuthorization} from './api';

export const setupAuth = () => {
  const token = Cookies.get('authorization');
  if (token) {
    setAuthorization(token);
  }
};

export const saveAuth = (token) => {
  Cookies.set('authorization', token);
  setAuthorization(token);
};
