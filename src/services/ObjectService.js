import axios from "axios";
require("dotenv").config();

/* let API_URL = process.env.REACT_APP_API_URL + "/"; */

class ObjectService {

  constructor(type) {
    console.log(type);
    this.API_URL = process.env.REACT_APP_API_URL + "/" + type;
  }

  getObjects() {
    return axios.get(this.API_URL);
  }

  getObjectsPaginados(pagina, limite) {
    return axios.get(this.API_URL + `?pagina=${pagina}&limite=${limite}`);
  }

/*   createObject(objeto) {
    return axios.post(this.API_URL, objeto);
  }

  updateObject(objeto, objetoId) {
    return axios.patch(
      this.API_URL + "/" + objetoId,
      objeto
    );
  }

  deleteObject(objetoId) {
    return axios.delete(this.API_URL + "/" + objetoId);
  }

  getObjectById(objetoId) {
    return axios.get(this.API_URL + "/" + objetoId);
  }

  getObjectsByList(array) {
    return axios.get(this.API_URL + "/list/" + array);
  }

  getMoradorByApartamento(apartamentoId) {
    return axios.get(this.API_URL + "/" + apartamentoId + "/moradores");
  }

  getVeiculoByApartamento(apartamentoId) {
    return axios.get(this.API_URL + "/" + apartamentoId + "/veiculos");
  }

  getVisitanteByApartamento(apartamentoId) {
    return axios.get(this.API_URL + "/" + apartamentoId + "/visitantes");
  } */

}

export default new ObjectService();
