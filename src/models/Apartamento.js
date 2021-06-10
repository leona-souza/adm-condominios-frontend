import ObjectService from "../services/ObjectService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

const retornoApartamento = {
  apiUrl: ObjectService.API_URL+'/apartamentos',
  titulo: "Lista de Apartamentos",
  adicionar: "Adicionar apartamento",
  colunasDeListagem: [
    "Apartamento",
    "Torre",
    "Vaga"
  ],

  mensagemDeletar: function(objeto) {
    return `Deseja realmente excluir o apartamento ${objeto.numero}-${objeto.torre}?`
  },

  coletarDados: function(paginaAtual, setObjects) {
    ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);

      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total);
      res.data.resultados.forEach(obj => delete obj.obs);

      setObjects({
        valores: res.data.resultados,
        equivalencias: new Map([
          ["numero", "Número"],
          ["torre", "Torre"],
          ["vaga", "Vaga"]
        ])
      });
    })
    .catch(e => console.log(e));
  },

  add: function() {
    window.location.href = "/gerenciar-apartamento/novo";
  },

  view: function(id) {
    window.location.href = `/ver-apartamento/${id}`;
  },

  put: function(id) {
    window.location.href = `/gerenciar-apartamento/${id}`;
  }
}


export default retornoApartamento;
