import axios from 'axios';
import { notification } from 'antd';
import { BASE_URL,BASE_ZPD } from './config';
import authHeader from './authHeader';
// import { useDispatch } from "react-redux";
import { clearUserInfo } from "../store/userSlice";
import { clearSubject } from "../store/subjectSlice";
import { clearRecords } from "../store/recordSlice";
// import { clearBackup } from "../store/backupSlice"; // 如果有
import store from '../store';
import { encrypt } from './crypto';
import { decrypt } from './crypto';

// const dispatch = useDispatch();
// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block'
  }
});

// 请求拦截器 - 自动添加认证头
// 2025/5/16修改请求拦截器，加密请求数据
axiosInstance.interceptors.request.use(
  async config => {
    // 如果请求配置中没有指定不添加认证头
    if (config.noAuth !== true) {
      const headers = authHeader();
      // 合并现有headers和认证headers
      config.headers = {
        ...config.headers,
        ...headers
      };
    }

    // 加密请求数据
    if (config.data && config.encryptRequest !== false) {
      // config.data = {
      //   minhuizpd: encrypt(config.data, secretKey)
      // };
        try {
          const secretKey = import.meta.env.VITE_ENCRYPTION_KEY+BASE_ZPD+'zhiping'; // 从环境变量获取密钥
          let dataToEncrypt = config.data;

          // 如果是FormData，转换为普通对象
          // if (config.data instanceof FormData) {
          //   dataToEncrypt = {};
          //   for (let [key, value] of config.data.entries()) {
          //     // 如果是文件，直接赋值；否则转为字符串
          //     dataToEncrypt[key] = value;
          //   }
          // }

          if (config.data instanceof FormData) {
            dataToEncrypt = {};
            const filePromises = [];
            for (let [key, value] of config.data.entries()) {
              if (value instanceof File) {
                // 支持多文件字段
                if (!dataToEncrypt[key]) dataToEncrypt[key] = [];
                // 转base64
                filePromises.push(new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = e => {
                    dataToEncrypt[key].push({
                      fileName: value.name,
                      contentType: value.type,
                      base64: e.target.result.split(',')[1]
                    });
                    resolve();
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(value);
                }));
              } else {
                dataToEncrypt[key] = value;
              }
            }
            // 等待所有文件转码完成
            await Promise.all(filePromises);
          }

          const result = encrypt(dataToEncrypt, secretKey);

          // const result = encrypt(config.data,secretKey);

          config.data = { 
            iv: result.iv,
            minhuizpd: result.content 
          };
          // 关键：加密后强制设置 Content-Type 为 application/json
          config.headers['Content-Type'] = 'application/json';

        } catch (error) {
          console.error('Encryption error:', error);
        }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理 token 过期等错误
// 2025/5/16修改响应拦截器，解密响应数据
axiosInstance.interceptors.response.use(
  response => {
   // 解密响应数据
    if (response.data && response.data.minhuizpd && response.config.decryptResponse !== false) {
      const secretKey = import.meta.env.VITE_ENCRYPTION_KEY+BASE_ZPD+'zhiping'; // 从环境变量获取密钥
      response.data = decrypt(response.data.minhuizpd, secretKey);
    }
    return response;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
      
      // 处理 token 过期情况
      if ( status === 400 || status === 401 || status === 403) {
        // 检查是否是token过期
        const isTokenExpired = data && 
          (data.code === 4001 || data.code === 4002 || data.code === 4003 );
        const isLoginError = data && 
          (data.code === 4011 || data.code === 4012 );
        // const isUnauthorized = status === 401 || isTokenExpired;
        
        if (isTokenExpired) {
          store.dispatch(clearUserInfo());
          store.dispatch(clearSubject());
          store.dispatch(clearRecords());
          // store.dispatch(clearBackup()); // 如果有
      
          // 显示通知
          notification.error({
            message: data?.message && data.message.includes('authentication')
              ? '认证失败，需要重新认证'
              : data?.message,
            description: '请重新登录系统',
            duration: 4,
          });
          
          // 延迟跳转，让用户有时间看到通知
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else if (isLoginError) {
          // 显示通知
          notification.error({
            message: data?.message,
            description: '登录失败，请重新登录',
            duration: 4,
          });
        } else if (status === 400) {
          // 显示通知
          notification.error({
            message: data?.message,
            description: '业务错误',
            duration: 4,
          });
        } else {
          // 其他授权错误
          notification.error({
            message: '权限错误',
            description: data?.message || '您没有权限执行此操作',
            duration: 4,
          });
        }
        error.__notified = true; // 标记已弹窗
      } 
      else if (status >= 500) {
        // 服务器错误
        notification.error({
          message: '后台错误',
          description: data?.message || '后台暂时无法响应，请稍后再试',
          duration: 4,
        });
        error.__notified = true; // 标记已弹窗
      } 
      // else {
      //   // 其他错误
      //   notification.error({
      //     message: '请求失败',
      //     description: data?.message || '操作未能完成，请重试',
      //     duration: 4,
      //   });
      // }
    } 
    // else if (error.request) {
    //   // 请求已发送但没有收到响应
    //   notification.error({
    //     message: '网络错误',
    //     description: '无法连接到后台服务器，再次尝试(包括退出重新登陆后重试)无效的情况下，请联系管理员',
    //     duration: 4,
    //   });
    // } else {
    //   // 请求配置出错
    //   notification.error({
    //     message: '请求错误',
    //     description: error.message,
    //     duration: 4,
    //   });
    // }
    
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