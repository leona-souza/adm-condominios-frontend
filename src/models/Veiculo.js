import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

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



export const veiculoModelListagem = {
  ...funcoesComuns,
  apiUrl: ObjectService.API_URL+'/veiculos',
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
        ...this,
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
  },

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
  }
}

export const veiculoModelDetalhes = {
  ...funcoesComuns
}

export default {
  veiculoModelListagem,
  veiculoModelDetalhes
};
