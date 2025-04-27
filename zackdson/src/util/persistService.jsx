import axios from "axios";
import authHeader from "./authHeader";
import { BASE_URL } from "./config";

const API_PER_URL = `${BASE_URL}/persist/`;


const serializeTofile = (branch) => {
    return axios.get(API_PER_URL + `serialize/${branch}`,{
      headers : authHeader()
    });
};

const deserializeToClass = (branch,filename) => {
    return axios.get(API_PER_URL + `deserialize/${branch}/${filename}`,{
      headers : authHeader()
    });
};

const PersistService = {
    serializeTofile,
    deserializeToClass,
  };
  
  export default PersistService;
