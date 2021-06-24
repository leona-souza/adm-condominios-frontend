import axios from "axios";
import { LIMITE } from "../resources/Config";
require("dotenv").config();

const ObjectService = {
  API_URL: process.env.REACT_APP_API_URL,

  getObjects: function() {
    return axios.get(this.API_URL);
  },

  getObjectsPaginados: function(pagina, tipo) {
    return axios.get(tipo + `?pagina=${pagina}&limite=${LIMITE}`);
  },

  createObject: function(objeto) {
    return axios.post(this.API_URL, objeto);
  },

  updateObject: function(objeto, objetoId) {
    return axios.patch(
      this.API_URL + "/" + objetoId,
      objeto
    );
  },

  deleteObject: function(objetoId) {
    return axios.delete(this.API_URL + "/" + objetoId);
  },

  getObjectById: function(objetoId) {
    return axios.get(this.API_URL + "/" + objetoId);
  },

  getObjectsByList: function(array) {
    return axios.get(this.API_URL + "/list/" + array);
  },

  getMoradorByApartamento: function(apartamentoId) {
    return axios.get(this.API_URL + "/" + apartamentoId + "/moradores");
  },

  getVeiculoByApartamento: function(apartamentoId) {
    return axios.get(this.API_URL + "/" + apartamentoId + "/veiculos");
  },

  getVisitanteByApartamento: function(apartamentoId) {
    return axios.get(this.API_URL + "/" + apartamentoId + "/visitantes");
  },
  
  hasZeroResults : function(numero) {
    if (numero === 0) {
      throw new Error("Nenhum registro encontrado");
    }
  }
}

export default ObjectService;
