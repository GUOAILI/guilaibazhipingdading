import http from './axiosInstance';
import { BASE_URL } from "./config";

const API_SUB_URL = `${BASE_URL}/subject/`;
const API_BRA_URL = `${BASE_URL}/branch/`;
// const API_UPLOAD_URL = "http://localhost:9000/notebook/";

const getAllSubjects = () => {
  return http.get(API_SUB_URL + "all");
};

// const getOneSubject = (subname) => {
//     return axios.post(API_SUB_URL + "one"+`?subname=${subname}`,{
//       headers : authHeader()
//     });
// };

// const updateOneSubject = (updData) => {
//     // return axios.post(API_SUB_URL + "update/one"+`?updData=${updData}`);
//     return axios.post(API_SUB_URL + "update/one",updData,{
//       headers : authHeader()
//     });
// };
// 2024/6/24 add
const getInitDson = () => {
  return http.get(API_SUB_URL + "initDson");
};

const getOneInitDson = (subname) => {
    return http.post(API_SUB_URL + "initDson/one"+`?subname=${subname}`,null);
};

const updateOneInitDson = (updData) => {
    return http.post(API_SUB_URL + "initDson/update/one",updData);
};

const getAllBranches = () => {
  return http.get(API_BRA_URL + "all");
};

// 2024/7/3
const addOneSubject = (subname) => {
  return http.post(API_SUB_URL + "add/one"+`?subname=${subname}`,null);
};
const deleteOneSubject = (subname) => {
  return http.post(API_SUB_URL + "delete/one"+`?subname=${subname}`,null);
};
const addOneBranch = (brhname) => {
  return http.post(API_BRA_URL + "add/one"+`?brhname=${brhname}`,null);
};
const deleteOneBranch = (brhname) => {
  return http.post(API_BRA_URL + "delete/one"+`?brhname=${brhname}`,null);
};


const MenuService = {
  getAllSubjects,
  getAllBranches,
  // 2024/6/24
  getInitDson,
  getOneInitDson,
  updateOneInitDson,
  // 2024/7/3
  addOneSubject,
  deleteOneSubject,
  addOneBranch,
  deleteOneBranch,
};

export default MenuService;