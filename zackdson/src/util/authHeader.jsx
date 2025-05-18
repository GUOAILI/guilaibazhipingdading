// import { useSelector } from "react-redux";
import store from '../store';
export default function authHeader() {
    // const user = JSON.parse(localStorage.getItem('user'));
    // const token = localStorage.getItem('token');
    const token = store.getState().user.token;
  
    if (token) {
      // return { Authorization: 'Bearer ' + user.accessToken };
      return { Authorization: 'Bearer ' + token };
    } else {
      return {};
    }
  }