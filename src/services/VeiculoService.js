import axios from "axios";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL + "/veiculos";

class VeiculoService {
  getVeiculos() {
    return axios.get(API_URL);
  }

  createVeiculo(veiculo) {
    return axios.post(API_URL, veiculo);
  }

  getVeiculoById(veiculoId) {
    return axios.get(API_URL + "/" + veiculoId);
  }

  updateVeiculo(veiculo, veiculoId) {
    return axios.patch(API_URL + "/" + veiculoId, veiculo);
  }

  deleteVeiculo(veiculoId) {
    return axios.delete(API_URL + "/" + veiculoId);
  }
}

export default new VeiculoService();
