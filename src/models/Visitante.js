import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

const retornoVisitante = {
  apiUrl: process.env.REACT_APP_API_URL + "/visitantes",
  titulo: "Lista de Visitantes",
  adicionar: "Adicionar visitante",
  colunasDeListagem: [
    "Nome",
    "Apartamento"
  ],

  equivalencia: function() {
    let valores = new Map();
    valores.set("nome", "Nome");
    valores.set("apartamentoVisitante", "Apartamento");
    return valores;
  }(),

  mensagemDeletar: function(objeto) {
    return `Deseja realmente excluir o visitante ${objeto.nome}?`
  },

  coletarDados: function(paginaAtual, setObjects) {
    let mapaAptos = new Map();
    let listaDeVisitantes = [];
    
    ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => delete obj.documento);
      res.data.resultados.forEach(obj => delete obj.telefone);
      res.data.resultados.forEach(obj => delete obj.obs);
      listaDeVisitantes = res.data.resultados;
    })
    .then(async () => { 
       await this.mapearVisitantes(mapaAptos, listaDeVisitantes);
    })
    .then(() => {
      this.converterDados(listaDeVisitantes, mapaAptos);
    })
    .then(() => {
      setObjects({
        valores: listaDeVisitantes,
        equivalencias: this.equivalencia
      });
    })
    .catch((e) => {
      console.log(e);
    });
  },

  mapearVisitantes: async function(mapa, array) {
    array.forEach(dado => {
      mapa.set(dado.apartamentoVisitante, "");
    });
    const arrayVisitantes = Array.from(mapa.keys());
    await ApartamentoService.getApartamentosByList(arrayVisitantes)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
    });
  },

  converterDados: function(lista, mapa) {
    lista.forEach(
      visitante => visitante.apartamentoVisitante = mapa.get(visitante.apartamentoVisitante)
    );
  },

  add: function() {
    window.location.href = "/gerenciar-visitante/novo";
  },

  view: function(id) {
    window.location.href = `/ver-visitante/${id}`;
  },

  put: function(id) {
    window.location.href = `/gerenciar-visitante/${id}`;
  }

}

export default retornoVisitante;
