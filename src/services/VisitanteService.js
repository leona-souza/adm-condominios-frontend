import axios from "axios";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL + "/visitantes";

class VisitanteService {
  getVisitantes() {
    return axios.get(API_URL);
  }

  createVisitante(visitante) {
    return axios.post(API_URL, visitante);
  }

  getVisitanteById(visitanteId) {
    return axios.get(API_URL + "/" + visitanteId);
  }

  getVisitantesByList(array) {
    return axios.get(API_URL + "/list/" + array);
  }

  getVisitanteByNome(visitanteNome) {
    return axios.get(API_URL + "/nome/" + visitanteNome);
  }

  updateVisitante(visitante, visitanteId) {
    return axios.patch(API_URL + "/" + visitanteId, visitante);
  }

  deleteVisitante(visitanteId) {
    return axios.delete(API_URL + "/" + visitanteId);
  }
}

export default new VisitanteService();
