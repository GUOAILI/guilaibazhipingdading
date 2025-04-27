import axios from "axios";
import authHeader from "./authHeader";
import { BASE_URL } from "./config";

const API_USR_URL = `${BASE_URL}/user/`;


const getCurrentUser = () => {
    return axios.get(API_USR_URL + "current",{
      headers : authHeader()
    });
};

const UserService = {
    getCurrentUser,
  };
  
  export default UserService;
