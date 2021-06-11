import ObjectService from "../services/ObjectService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";
import ApartamentoService from "../services/ApartamentoService";

/**********************/
/*** FUNÇÕES COMUNS ***/
/**********************/
const funcoesComuns = {
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

/**********************/
/* MODELO DE LISTAGEM */
/**********************/
export const apartamentoModelListagem = {
  ...funcoesComuns,
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

  coletarDados: async function(paginaAtual) {
    let retorno = {};
    await ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total);
      res.data.resultados.forEach(obj => delete obj.obs);
      retorno = {
        ...this,
        valores: res.data.resultados,
        equivalencias: new Map([
          ["numero", "Número"],
          ["torre", "Torre"],
          ["vaga", "Vaga"]
        ])
      };
    })
    .catch(e => console.log(e));

    return retorno;
  }
}

/**********************/
/* MODELO DE DETALHES */
/**********************/
export const apartamentoModelDetalhes = {
  ...funcoesComuns,
  titulo: "Ver detalhes do apartamento",
  avatarCss: "fonte__apartamento",

  listarTodos: function() {
    window.location.href= "/apartamentos";
  },
  listarMoradores: function(listaMoradores) {
    return listaMoradores?.map(
      (morador, index) => (index ? ", " : "") + morador.nome
    )
  },
  listarVeiculos: function(listaVeiculos) {
    return listaVeiculos?.map(
      (veiculo, index) => (index ? ", " : "") + veiculo.placa
    )
  },
  listarVisitantes: function(listaVisitantes) {
    return listaVisitantes?.map(
      (visitante, index) => (index ? ", " : "") + visitante.nome
    )
  },

  coletarDados: async function(id) {
    let apartamento = {};
    let moradores = [];
    let veiculos = [];
    let visitantes = [];

    await ApartamentoService.getApartamentoById(id).then(res => {
      apartamento = res.data;
    });
    await ApartamentoService.getMoradorByApartamento(id).then(res => {
      moradores = res.data;
    });
    await ApartamentoService.getVeiculoByApartamento(id).then(res => {
      veiculos = res.data;
    });
    await ApartamentoService.getVisitanteByApartamento(id).then(res => {
      visitantes = res.data;
    });

    return {
      ...this,
      id: apartamento.id,
      valorAvatar: `${apartamento.numero}-${apartamento.torre}`,
      valores: [
        { nome: "Vaga", valor: apartamento.vaga },
        { nome: "Moradores", valor: this.listarMoradores(moradores) },
        { nome: "Veículos", valor: this.listarVeiculos(veiculos) },
        { nome: "Visitantes", valor: this.listarVisitantes(visitantes) },
        { nome: "Obs", valor: apartamento.obs },
      ]
    };
  }
}

export default {
  apartamentoModelListagem,
  apartamentoModelDetalhes
}
