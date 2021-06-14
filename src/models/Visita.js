import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import VisitanteService from "../services/VisitanteService";
import VisitaService from "../services/VisitaService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

/**********************/
/*** FUNÇÕES COMUNS ***/
/**********************/
const funcoesComuns = {
  add: function() {
    window.location.href = "/gerenciar-visita/novo";
  },
  view: function(id) {
    window.location.href = `/ver-visita/${id}`;
  },
  put: function(id) {
    window.location.href = `/gerenciar-visita/${id}`;
  }
}

/**********************/
/* MODELO DE LISTAGEM */
/**********************/
export const visitaModelListagem = {
  apiUrl: process.env.REACT_APP_API_URL + "/visitas",

  mapearApartamentos: async function(mapa, array) {
    array.forEach(dado => mapa.set(dado.apartamento, ""));
    const arrayApartamentos = Array.from(mapa.keys());
    if (arrayApartamentos[0]) {
      await ApartamentoService.getApartamentosByList(arrayApartamentos)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
      });
    }
  },
  mapearVisitantes: async function(mapa, array) {
    array.forEach(dado => mapa.set(dado.visitante, ""));
    const arrayVisitantes = Array.from(mapa.keys());
    await VisitanteService.getVisitantesByList(arrayVisitantes)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.nome);
        });    
    });
  },
  converterDados: function(array, mapaAptos, mapaNomes) {
    for (const key in array) {
      const nome = mapaNomes.get(array[key].visitante);
      const apto = mapaAptos.get(array[key].apartamento);
      array[key].visitante = nome;
      array[key].apartamento = apto;
      array[key].data = Functions.dataFromDbToScreen(array[key].data);
    };
  },

  coletarDados: async function(paginaAtual) {
    let retorno = [];
    let mapaAptos = new Map();
    let mapaNomes = new Map();
    let listaDeVisitas = [];

    await VisitaService.getVisitasPaginadas(paginaAtual, LIMITE)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => delete obj.obs);
      listaDeVisitas = res.data.resultados;
    })
    .then(async () => {
      await this.mapearApartamentos(mapaAptos, listaDeVisitas);
    })
    .then(async () => {
      await this.mapearVisitantes(mapaNomes, listaDeVisitas);
    })
    .then(() => {
      this.converterDados(listaDeVisitas, mapaAptos, mapaNomes);
    })
    .then(() => {
      retorno = {
        ...funcoesComuns,
        titulo: "Lista de Visitas",
        adicionar: "Adicionar visita",
        colunasDeListagem: [
          "Data",
          "Visitante",
          "Apartamento"
        ],

        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir a visita ${objeto.data}?`
        },

        valores: listaDeVisitas,
        equivalencias: new Map([
          ["data", "Data"],
          ["nome", "Nome"],
          ["apartamentoVisitante", "Apartamento"]
        ])
      }
    })
    .catch(e => console.log(e));  
    return retorno;
  }
}

export const visitaModelDetalhes = {
  coletarDados: async function(id) {
    let visita = {};
    let visitante = "";
    let apartamento = "";

    await VisitaService.getVisitaById(id)
      .then(res => visita = res.data)
      .catch(e => console.log(e));
    await VisitanteService.getVisitanteById(visita.visitante)
      .then(res => visitante = res.data.nome)
      .catch(e => console.log(e));
    await ApartamentoService.getApartamentoById(visita.apartamento)
      .then(res => apartamento = `${res.data.numero}-${res.data.torre}`)
      .catch(e => console.log(e));

    return {
      ...funcoesComuns,
      id: visita.id,
      titulo: "Ver detalhes da visita",
      avatarCss: "fonte__visita",
      valorAvatar: Functions.dataFromDbToScreen(visita.data),
      listarTodos:"/visitas",
      
      valores: [
        { nome: "Visitante", valor: visitante },
        { nome: "Apartamento", valor: apartamento },
        { nome: "Obs", valor: visita.obs }
      ]
    }
  }
}

export default {
  visitaModelListagem,
  visitaModelDetalhes
};