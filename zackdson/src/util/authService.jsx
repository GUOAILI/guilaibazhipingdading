import http from './axiosInstance';
import { BASE_URL } from "./config";

const API_LOGIN_URL = `${BASE_URL}/auth`;

const createuser = (user) => {
    // 登录和注册不需要认证头
    return http.noAuth.post(API_LOGIN_URL + '/register/save', user);
}

const loginuser = (user) => {
    // 登录和注册不需要认证头
    return http.noAuth.post(API_LOGIN_URL + '/login', user);
}

const AuthService = {
    createuser,
    loginuser,
};
  
export default AuthService;