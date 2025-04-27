import axios from "axios";
import authHeader from "./authHeader";
import { BASE_URL } from "./config";

const API_GRADE_URL = `${BASE_URL}/grade/`;

const getGrade = () => {
  return axios.get(API_GRADE_URL + "get",{
    headers : authHeader()
  });
};

const saveGrade= (school,grade) => {
    return axios.post(API_GRADE_URL + "save"+`?school=${school}&grade=${grade}`,null,{
      headers : authHeader()
    });
};

const deleteGrade= () => {
    return axios.get(API_GRADE_URL + "delete",{
      headers : authHeader()
    });
};

const GradeService = {
  getGrade,
  saveGrade,
  deleteGrade,
};

export default GradeService;