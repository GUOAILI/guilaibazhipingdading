import http from './axiosInstance';
import { BASE_URL } from "./config";

const API_GRADE_URL = `${BASE_URL}/grade/`;

const getGrade = () => {
  return http.get(API_GRADE_URL + "get");
};

const saveGrade= (school,grade) => {
    return http.post(API_GRADE_URL + "save"+`?school=${school}&grade=${grade}`,null);
};

const deleteGrade= () => {
    return http.get(API_GRADE_URL + "delete");
};

const GradeService = {
  getGrade,
  saveGrade,
  deleteGrade,
};

export default GradeService;