import axios from 'axios'
import { BASE_URL } from "./config";

const API_LOGIN_URL = `${BASE_URL}/auth`;

export const createuser = (user) => {
    return axios.post(API_LOGIN_URL + '/register/save', user)
}

export const loginuser = (user) => {
    // return axios.post(API_LOGIN_URL + '/login', user,{timeout:10000})
    return axios.post(API_LOGIN_URL + '/login', user)
}

const AuthService = {
    createuser,
    loginuser,
  };
  
  export default AuthService;