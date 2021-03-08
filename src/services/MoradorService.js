import axios from "axios";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL + "/moradores";

class MoradorService {
  getMoradores() {
    return axios.get(API_URL);
  }

  getMoradorById(moradorId) {
    return axios.get(API_URL + "/" + moradorId);
  }

  createMorador(morador) {
    return axios.post(API_URL, morador);
  }

  updateMorador(morador, moradorId) {
    return axios.patch(API_URL + "/" + moradorId, morador);
  }

  deleteMorador(moradorId) {
    return axios.delete(API_URL + "/" + moradorId);
  }
}

export default new MoradorService();
