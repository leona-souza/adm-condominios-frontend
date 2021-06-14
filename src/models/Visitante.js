import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";
import VisitanteService from "../services/VisitanteService";

/**********************/
/*** FUNÇÕES COMUNS ***/
/**********************/
const funcoesComuns = {
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

/**********************/
/* MODELO DE LISTAGEM */
/**********************/
export const visitanteModelListagem = {
  apiUrl: process.env.REACT_APP_API_URL + "/visitantes",

  mapearVisitantes: async function(mapa, array) {
    array.forEach(dado => mapa.set(dado.apartamentoVisitante, ""));
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

  coletarDados: async function(paginaAtual) {
    let retorno = {};
    let mapaAptos = new Map();
    let listaDeVisitantes = [];
    
    await ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => {
        const { id, nome, apartamentoVisitante } = obj;
        listaDeVisitantes.push({ id, nome, apartamentoVisitante });
      })
    })
    .then(async () => { 
       await this.mapearVisitantes(mapaAptos, listaDeVisitantes);
    })
    .then(() => {
      this.converterDados(listaDeVisitantes, mapaAptos);
    })
    .then(() => {
      retorno = {
        ...funcoesComuns,
        titulo: "Lista de Visitantes",
        adicionar: "Adicionar visitante",
        colunasDeListagem: [
          "Nome",
          "Apartamento"
        ],

        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir o visitante ${objeto.nome}?`
        },

        valores: listaDeVisitantes,
        equivalencias: new Map([
          ["nome", "Nome"],
          ["apartamentoVisitante", "Apartamento"]
        ])
      }
    })
    .catch(e => console.log(e));
    return retorno;
  }
}

/**********************/
/* MODELO DE DETALHES */
/**********************/
export const visitanteModelDetalhes = {
  coletarDados: async function(id) {
    let visitante = {};
    let apartamento = "";

    await VisitanteService.getVisitanteById(id)
      .then(res => visitante = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getApartamentoById(visitante.apartamentoVisitante)
      .then(res => apartamento = `${res.data.numero}-${res.data.torre}`)
      .catch(e => console.log(e));

    return {
      ...funcoesComuns,
      id: visitante.id,
      titulo: "Ver detalhes do visitante",
      avatarCss: "fonte__visitante",
      valorAvatar: visitante.nome,
      listarTodos:"/visitantes",

      valores: [
        { nome: "Apartamento", valor: apartamento },
        { nome: "Telefone", valor: visitante.telefone },
        { nome: "Documento", valor: visitante.documento },
        { nome: "Obs", valor: visitante.obs },
      ]
    }
  }
}

export default {
  visitanteModelListagem,
  visitanteModelDetalhes
};
