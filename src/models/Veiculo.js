import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

export default class Veiculo extends ObjectService {
  constructor() {
    super();
    this.setApiUrl(process.env.REACT_APP_API_URL + "/veiculos");
    this.titulo = "Lista de Veículos";
    this.adicionar = "Adicionar veículo";
    this.colunasDeListagem = [
        "Modelo",
        "Marca",
        "Cor",
        "Placa",
        "Apartamento"
      ];
    this.equivalencia = new Map();
    this.equivalencia.set("modelo", "Modelo");
    this.equivalencia.set("marca", "Marca");
    this.equivalencia.set("placa", "Placa");
    this.equivalencia.set("cor", "Cor");
    this.equivalencia.set("apartamentoVeiculo", "Apartamento");
  }

  mensagemDeletar = (objeto) => {
    return `Deseja realmente excluir o veículo ${objeto.placa}?`
  }

  coletarDados = (paginaAtual, thisPai) => {
    let mapaAptos = new Map();
    let listaDeVeiculos = [];

    this.getObjectsPaginados(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
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
      thisPai.setState({ objects: listaDeVeiculos });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  mapearVeiculos = async (mapa, array) => {
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
  }

  converterDados = (lista, mapa) => {
    lista.forEach(
      veiculo => veiculo.apartamentoVeiculo = mapa.get(veiculo.apartamentoVeiculo)
    );
  }

  add = () => {
    window.location.href = "/gerenciar-veiculo/novo";
  }
  view = (id) => {
    window.location.href = `/ver-veiculo/${id}`;
  }
  put = (id) => {
    window.location.href = `/gerenciar-veiculo/${id}`;
  }

}
