import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";
import VeiculoService from "../services/VeiculoService";

/**********************/
/*** FUNÇÕES COMUNS ***/
/**********************/
const funcoesComuns = {
  add: function() {
    window.location.href = "/gerenciar-veiculo/novo";
  },
  view: function(id) {
    window.location.href = `/ver-veiculo/${id}`;
  },
  put: function(id) {
    window.location.href = `/gerenciar-veiculo/${id}`;
  }
}

/**********************/
/* MODELO DE LISTAGEM */
/**********************/
export const veiculoModelListagem = {
  apiUrl: ObjectService.API_URL+'/veiculos',

  mapearVeiculos: async function(mapa, array) {
    array.forEach(dado => {
      mapa.set(dado.apartamentoVeiculo, "");
    });
    const arrayVeiculos = Array.from(mapa.keys());
    await ApartamentoService.getApartamentosByList(arrayVeiculos)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
    });
  },

  converterDados: function(lista, mapa) {
    lista.forEach(
      veiculo => veiculo.apartamentoVeiculo = mapa.get(veiculo.apartamentoVeiculo)
    );
  },

  coletarDados: async function(paginaAtual) {
    let retorno = [];
    let mapaAptos = new Map();
    let listaDeVeiculos = [];

    await ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => delete obj.obs);
      listaDeVeiculos = res.data.resultados;
    })
    .then(async () => {
      await this.mapearVeiculos(mapaAptos, listaDeVeiculos);
    })
    .then(() => {
      this.converterDados(listaDeVeiculos, mapaAptos);
    })
    .then(() => {
      retorno = { 
        ...funcoesComuns,
        titulo: "Lista de Veículos",
        adicionar: "Adicionar veículo",
        colunasDeListagem: [
          "Modelo",
          "Marca",
          "Cor",
          "Placa",
          "Apartamento"
        ],
        
        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir o veículo ${objeto.placa}?`
        },

        valores: listaDeVeiculos,
        equivalencias: new Map([
          ["modelo", "Modelo"],
          ["marca", "Marca"],
          ["placa", "Placa"],
          ["cor", "Cor"],
          ["apartamentoVeiculo", "Apartamento"]
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
export const veiculoModelDetalhes = {

  coletarDados: async function(id) {
    let veiculo = {};
    let apartamento = "";

    await VeiculoService.getVeiculoById(id)
      .then(res => veiculo = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getApartamentoById(veiculo.apartamentoVeiculo)
      .then(res => apartamento = `${res.data.numero}-${res.data.torre}`)
      .catch(e => console.log(e));

    return {
      ...funcoesComuns,
      id: veiculo.id,
      titulo: "Ver detalhes do veículo",
      avatarCss: "fonte__veiculo",
      valorAvatar: veiculo.placa,
      listarTodos: "/veiculos",

      valores: [
        { nome: "Marca", valor: veiculo.marca },
        { nome: "Modelo", valor: veiculo.modelo },
        { nome: "Cor", valor: veiculo.cor },
        { nome: "Apartamento", valor: apartamento },
        { nome: "Obs", valor: veiculo.obs }
      ]
    }
  }
}

export default {
  veiculoModelListagem,
  veiculoModelDetalhes
};
