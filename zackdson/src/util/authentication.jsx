import { redirect} from 'react-router-dom';
import store from '../store';
// import { useSelector } from 'react-redux';

export function getTokenDuration() {
  // const storedExpirationDate = localStorage.getItem('expiration');
  const storedExpirationDate = store.getState().user.expiration; 
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function getAuthToken() {
  // const token = localStorage.getItem('token');
  const token = store.getState().user.token;

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) {
    return null;
  }

  return token;
}

export function tokenLoader() {
  const token = getAuthToken();
  return token;
}
