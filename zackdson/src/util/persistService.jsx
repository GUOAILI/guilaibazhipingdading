import http from './axiosInstance';
import { BASE_URL } from "./config";

const API_PER_URL = `${BASE_URL}/persist/`;

const serializeAllDatabaseData = () => {
    return http.get(API_PER_URL + 'serializeAll');
};

const recoverToTable = (filename) => {
    // 注意：原代码没有使用 authHeader，保持一致
    return http.noAuth.get(API_PER_URL + `deserializeAll/${filename}`);
};

const unZipTheFile = (filename) => {
    // 注意：原代码没有使用 authHeader，保持一致
    return http.noAuth.get(API_PER_URL + `unzipAll/${filename}`);
};
const getProgress = (taskID) => {
    // 注意：原代码没有使用 authHeader，保持一致
    return http.noAuth.get(API_PER_URL + `progress/${taskID}`);
};

const PersistService = {
    recoverToTable,
    unZipTheFile,
    serializeAllDatabaseData,
    getProgress
};
  
export default PersistService;
