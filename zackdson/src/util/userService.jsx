import http from './axiosInstance';
import { BASE_URL } from "./config";

const API_USR_URL = `${BASE_URL}/user/`;

const getCurrentUser = () => {
  return http.get(API_USR_URL + "current");
};

const UserService = {
  getCurrentUser,
};
  
export default UserService;
