import http from './axiosInstance';
import { BASE_URL } from "./config";

const API_FILE_URL = `${BASE_URL}/localupload/`;

// const getAllFiles = () => {
//   return axios.get(API_FILE_URL + "files");
// };

// const getOneFile= (filename) => {
//     return axios.post(API_FILE_URL + "files/"+`${filename}`);
// };

// const uploadFile = (updData) => {
//     return axios.post(API_FILE_URL + "upload",updData,
//       {
//         Headers:{
//           'Content-Type': 'multipart/form-data',
//         }
//       }
// )};
const uploadFileAndSaveToWritingDb = (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/writing", updData);
};
const uploadFileAndSaveToCommonDb = (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/common", updData);
};

const uploadFileAndSaveToNotebookDb = (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/notebook", updData);
};

const uploadFileAndSaveToExamDb = (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/exam", updData);
};

const uploadFileAndSaveToReviewDb = (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/review", updData);
};

const uploadFileAndSaveToWrongDb = (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/wrong", updData);
};

const uploadFileAndSaveToExtDb = (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/extension", updData);
};
// Upload a new summary
const uploadFileAndSaveToSummaryDb= (updData) => {
    return http.post(API_FILE_URL + "baiduwenxin/summary", updData);
}

const FileService = {
  // getAllFiles,
  // getOneFile,
  // uploadFile,
  uploadFileAndSaveToWritingDb,
  uploadFileAndSaveToNotebookDb,
  uploadFileAndSaveToExamDb,
  uploadFileAndSaveToReviewDb,
  uploadFileAndSaveToWrongDb,
  uploadFileAndSaveToExtDb,
  uploadFileAndSaveToCommonDb, // 新增
  uploadFileAndSaveToSummaryDb, // 新增
};

export default FileService;