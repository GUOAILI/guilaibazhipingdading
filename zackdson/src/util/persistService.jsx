import axios from "axios";
import authHeader from "./authHeader";
import { BASE_URL } from "./config";

const API_PER_URL = `${BASE_URL}/persist/`;

const serializeAllDatabaseData = () => {
    return axios.get(API_PER_URL + 'serializeAll',{
      headers : authHeader()
    });
};
const recoverToTable = (filename) => {
    return axios.get(API_PER_URL + `deserializeAll/${filename}`);
    // return axios.get(API_PER_URL + `deserializeAll/${filename}`,{
    //   headers : authHeader()
    // });
};

const PersistService = {
    recoverToTable,
    serializeAllDatabaseData,
  };
  
  export default PersistService;
