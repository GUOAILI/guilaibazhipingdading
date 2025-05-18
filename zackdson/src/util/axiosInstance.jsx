import axios from 'axios';
import { notification } from 'antd';
import { BASE_URL } from './config';
import authHeader from './authHeader';
// import { useDispatch } from "react-redux";
import { clearUserInfo } from "../store/userSlice";
import { clearSubject } from "../store/subjectSlice";
import { clearRecords } from "../store/recordSlice";
import { clearBackup } from "../store/backupSlice"; // 如果有
import store from '../store';

// const dispatch = useDispatch();
// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // }
});

// 请求拦截器 - 自动添加认证头
axiosInstance.interceptors.request.use(
  config => {
    // 如果请求配置中没有指定不添加认证头
    if (config.noAuth !== true) {
      const headers = authHeader();
      // 合并现有headers和认证headers
      config.headers = {
        ...config.headers,
        ...headers
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理 token 过期等错误
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
      
      // 处理 token 过期情况
      if (status === 401 || status === 403) {
        // 检查是否是token过期
        const isTokenExpired = data && data.code === 4001;
        const isUnauthorized = status === 401 || isTokenExpired;
        
        if (isUnauthorized) {
          // 清除本地存储的 token
          // localStorage.removeItem("dpj-sb");
          // localStorage.removeItem("school");
          // localStorage.removeItem("grade");
          // localStorage.removeItem("resetGrade");
          // localStorage.removeItem("subject");
          // localStorage.removeItem("branchDetail");
          // localStorage.removeItem("notebookRecord");
          // localStorage.removeItem("writingRecord");
          // localStorage.removeItem("commonRecord");
          // localStorage.removeItem("wrongRecord");
          // localStorage.removeItem("examRecord");
          // localStorage.removeItem("reviewRecord");
          // localStorage.removeItem("extensionRecord");
          // localStorage.removeItem("long");
          // localStorage.removeItem("token");
          // localStorage.removeItem("expiration");
          store.dispatch(clearUserInfo());
          store.dispatch(clearSubject());
          store.dispatch(clearRecords());
          store.dispatch(clearBackup()); // 如果有
      
          // 显示通知
          notification.warning({
            message: '登录已过期',
            description: '请重新登录系统',
            duration: 3,
          });
          
          // 延迟跳转，让用户有时间看到通知
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } 
        // else {
        //   // 其他授权错误
        //   notification.error({
        //     message: '权限错误',
        //     description: data?.message || '您没有权限执行此操作',
        //     duration: 4,
        //   });
        // }
      } else if (status >= 500) {
        // 服务器错误
        notification.error({
          message: '服务器错误',
          description: data?.message || '服务器暂时无法响应，请稍后再试',
          duration: 4,
        });
      } else {
        // 其他错误
        notification.error({
          message: '请求失败',
          description: data?.message || '操作未能完成，请重试',
          duration: 4,
        });
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      notification.error({
        message: '网络错误',
        description: '无法连接到后台服务器，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员',
        duration: 4,
      });
    } else {
      // 请求配置出错
      notification.error({
        message: '请求错误',
        description: error.message,
        duration: 4,
      });
    }
    
    return Promise.reject(error);
  }
);

// 提供便捷方法，保持与原有服务兼容
const http = {
  get: (url, config) => axiosInstance.get(url, config),
  post: (url, data, config) => axiosInstance.post(url, data, config),
  put: (url, data, config) => axiosInstance.put(url, data, config),
  delete: (url, config) => axiosInstance.delete(url, config),
  // 不添加认证头的请求方法（用于登录等）
  noAuth: {
    get: (url, config) => axiosInstance.get(url, { ...config, noAuth: true }),
    post: (url, data, config) => axiosInstance.post(url, data, { ...config, noAuth: true }),
    put: (url, data, config) => axiosInstance.put(url, data, { ...config, noAuth: true }),
    delete: (url, config) => axiosInstance.delete(url, { ...config, noAuth: true }),
  }
};

export default http;