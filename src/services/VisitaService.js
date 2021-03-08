import axios from "axios";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL + "/visitas";

class VisitaService {
  getVisitas() {
    return axios.get(API_URL);
  }

  createVisita(visita) {
    return axios.post(API_URL, visita);
  }

  getVisitaById(visitaId) {
    return axios.get(API_URL + "/" + visitaId);
  }

  updateVisita(visita, visitaId) {
    return axios.patch(API_URL + "/" + visitaId, visita);
  }

  deleteVisita(visitaId) {
    return axios.delete(API_URL + "/" + visitaId);
  }
}

export default new VisitaService();
