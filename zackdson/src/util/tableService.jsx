import http from './axiosInstance';
import { BASE_URL } from "./config";

const API_TABLE_URL = `${BASE_URL}/table/`;


const getAllWriting = (subject) => {
  return http.get(API_TABLE_URL + "writing"+`?subject=${subject}`);
};

const delOneWriting = (id) => {
  return http.post(API_TABLE_URL + "writing/delete"+`?id=${id}`,null);
  // return axios.put(API_TABLE_URL + "writing/delete",
  //   {
  //     params:{id:id}
  //   }
  // );
};

const getAllNotebook = (subject) => {
  return http.get(API_TABLE_URL + "notebook"+`?subject=${subject}`);
};

const delOneNotebook = (id) => {
  // return axios.put(API_TABLE_URL + "notebook/delete"+`?id=${id}`,null,{
  return http.post(API_TABLE_URL + "notebook/delete"+`?id=${id}`,null);
};
// 2024/6/25
const getAllExam = (subject) => {
  return http.get(API_TABLE_URL + "exam"+`?subject=${subject}`);
};

const delOneExam = (id) => {
  return http.post(API_TABLE_URL + "exam/delete"+`?id=${id}`,null);
};
// 
const getAllReview = (subject) => {
  return http.get(API_TABLE_URL + "review"+`?subject=${subject}`);
};

const delOneReview = (id) => {
  return http.post(API_TABLE_URL + "review/delete"+`?id=${id}`,null);
};
// 2023/6/29
const getAllWrong = (subject) => {
  return http.get(API_TABLE_URL + "wrong"+`?subject=${subject}`);
};

const delOneWrong = (id) => {
  return http.post(API_TABLE_URL + "wrong/delete"+`?id=${id}`,null);
};
const getAllSummary = (subject) => {
  return http.get(API_TABLE_URL + "summary"+`?subject=${subject}`);
};

const delOneSummary = (id) => {
  return http.post(API_TABLE_URL + "summary/delete"+`?id=${id}`,null);
};
// 2023/6/29 night
const getAllExt = (subject) => {
  return http.get(API_TABLE_URL + "extension"+`?subject=${subject}`);
};

const delOneExt = (id) => {
  return http.post(API_TABLE_URL + "extension/delete"+`?id=${id}`,null);
};
// 2024/7/1 add 
const updateWritingDb = (formData) => {
  return http.post(API_TABLE_URL + "writing/update",formData);
};
const updateWrongDb = (formData) => {
  return http.post(API_TABLE_URL + "wrong/update",formData);
};
const updateSummaryDb = (formData) => {
  return http.post(API_TABLE_URL + "summary/update",formData);
};
const updateExamDb = (formData) => {
  return http.post(API_TABLE_URL + "exam/update",formData);
};
const updateReviewDb = (formData) => {
  return http.post(API_TABLE_URL + "review/update",formData);
};
const updateNotebookDb = (formData) => {
  return http.post(API_TABLE_URL + "notebook/update",formData);
};
const updateExtensionDb = (formData) => {
  return http.post(API_TABLE_URL + "extension/update",formData);
};

// 获取所有common 2025/4/25 add
const getAllCommon = (subject) => {
  return http.get(API_TABLE_URL + "common" + `?subject=${subject}`);
};

// 删除common
const delOneCommon = (id) => {
  return http.post(API_TABLE_URL + "common/delete" + `?id=${id}`, null);
};

// 更新common
const updateCommonDb = (formData) => {
  return http.post(API_TABLE_URL + "common/update", formData);
};

const TableService = {
    getAllWriting,
    getAllNotebook,
    delOneWriting,
    delOneNotebook,
    getAllExam,
    delOneExam,
    getAllReview,
    delOneReview,
    getAllWrong,
    delOneWrong,
    getAllSummary,
    delOneSummary,
    getAllExt,
    delOneExt,
  // 2024/7/1 for update respective subject data
    updateWritingDb,
    updateWrongDb,
    updateSummaryDb,
    updateExamDb,
    updateNotebookDb,
    updateReviewDb,
    updateExtensionDb,
    // ==2025/4/27 common 相关 ======
    getAllCommon,
    delOneCommon,
    updateCommonDb
};

export default TableService;