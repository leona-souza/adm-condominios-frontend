import ObjectService from "../services/ObjectService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

const retornoApartamento = {
  //setApiUrl(process.env.REACT_APP_API_URL + "/apartamentos")
  apiUrl: ObjectService.API_URL+'/apartamentos',
  titulo: "Lista de Apartamentos",
  adicionar: "Adicionar apartamento",
  colunasDeListagem: [
    "Apartamento",
    "Torre",
    "Vaga"
  ],

  equivalencia: function () { 
    let valores = new Map()
    valores.set("numero", "Número");
    valores.set("torre", "Torre");
    valores.set("vaga", "Vaga");
    return valores;
  }(),

  mensagemDeletar: function(objeto) {
    return `Deseja realmente excluir o apartamento ${objeto.numero}-${objeto.torre}?`
  },

  coletarDados: function(paginaAtual, setObjects) {
    ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total);
      res.data.resultados.forEach(obj => delete obj.obs);
      setObjects({
        valores: res.data.resultados,
        equivalencias: this.equivalencia
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
