import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

const retornoVeiculo = {
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
  
  equivalencia: function() {
    let valores = new Map();
    valores.set("modelo", "Modelo");
    valores.set("marca", "Marca");
    valores.set("placa", "Placa");
    valores.set("cor", "Cor");
    valores.set("apartamentoVeiculo", "Apartamento");
    return valores;
  }(),

  mensagemDeletar: function(objeto) {
    return `Deseja realmente excluir o veículo ${objeto.placa}?`
  },

  coletarDados: function(paginaAtual, setObjects) {
    let mapaAptos = new Map();
    let listaDeVeiculos = [];

    ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
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
      setObjects({ 
        valores: listaDeVeiculos,
        equivalencias: this.equivalencia
      });
    })
    .catch((e) => {
      console.log(e);
    });
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
  },

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

export default retornoVeiculo;
