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
  apiUrl: ObjectService.API_URL+'/apartamentos',

  coletarDados: async function(paginaAtual) {
    let retorno = {};
    await ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total);
      res.data.resultados.forEach(obj => delete obj.obs);
      
      retorno = {
        ...funcoesComuns,

        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir o apartamento ${objeto.numero}-${objeto.torre}?`
        },

        titulo: "Lista de Apartamentos",
        adicionar: "Adicionar apartamento",
        colunasDeListagem: [
          "Apartamento",
          "Torre",
          "Vaga"
        ],

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

    await ApartamentoService.getApartamentoById(id)
      .then(res => apartamento = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getMoradorByApartamento(id)
      .then(res => moradores = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getVeiculoByApartamento(id)
      .then(res => veiculos = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getVisitanteByApartamento(id)
      .then(res => visitantes = res.data)
      .catch(e => console.log(e));

    return {
      ...funcoesComuns,
      id: apartamento.id,
      titulo: "Ver detalhes do apartamento",
      avatarCss: "fonte__apartamento",
      valorAvatar: `${apartamento.numero}-${apartamento.torre}`,
      listarTodos: "/apartamentos",

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

/************************/
/* MODELO DE FORMULÁRIO */
/************************/
export const apartamentoModelForm = {
  coletarDados: function(id) {
    let retorno = {};
    let valores = {};

    if (id === "novo") {
      valores = {
        id: "",
        numero: "",
        torre: "",
        vaga: "",
        obs: "",
        titulo: "Cadastrar apartamento"
      }
    };

    retorno = {
      campos: [
        { 
          titulo: "Número", 
          cssTitulo: "formulario__label required", 
          name: "numero", 
          value: valores.numero, 
          cssInput: "formulario__input",
          placeholder: "",
          tipo: "input"
        },
        { 
          titulo: "Torre", 
          cssTitulo: "formulario__label required", 
          name: "torre", 
          value: valores.torre, 
          cssInput: "formulario__input",
          placeholder: "",
          tipo: "input"
        },
        { 
          titulo: "Vaga", 
          cssTitulo: "formulario__label", 
          name: "vaga", 
          value: valores.vaga, 
          cssInput: "formulario__input",
          placeholder: "",
          tipo: "input"
        },
        { 
          titulo: "Obs", 
          cssTitulo: "formulario__label", 
          name: "obs", 
          value: valores.obs, 
          cssInput: "formulario__textarea",
          placeholder: "",
          rows: 5,
          tipo: "textarea"
        }
      ]
    }

    return retorno;
  }
}

export default {
  apartamentoModelListagem,
  apartamentoModelDetalhes,
  apartamentoModelForm
}
