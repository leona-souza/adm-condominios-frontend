import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

export default class Morador extends ObjectService {
  constructor() {
    super();
    this.setApiUrl(process.env.REACT_APP_API_URL + "/moradores");
    this.titulo = "Lista de Moradores";
    this.adicionar = "Adicionar morador";
    this.colunasDeListagem = [
        "Nome",
        "Apartamento"
      ];
      this.equivalencia = new Map();
      this.equivalencia.set("nome", "Nome");
      this.equivalencia.set("documento", "Documento");
      this.equivalencia.set("apartamentoMorador", "Apartamento");
  }

  mensagemDeletar = (objeto) => {
    return `Deseja realmente excluir o morador ${objeto.nome}?`
  }

  coletarDados = (paginaAtual, thisPai) => {
    let mapaAptos = new Map();
    let listaDeMoradores = [];
    
    this.getObjectsPaginados(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => delete obj.documento);
      res.data.resultados.forEach(obj => delete obj.telefone);
      res.data.resultados.forEach(obj => delete obj.obs);
      listaDeMoradores = res.data.resultados;
    })
    .then(async () => { 
       await this.mapearMoradores(mapaAptos, listaDeMoradores);
    })
    .then(() => {
      this.converterDados(listaDeMoradores, mapaAptos);
    })
    .then(() => {
      thisPai.setState({ objects: listaDeMoradores });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  mapearMoradores = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.apartamentoMorador, "");
    });
    const arrayMoradores = Array.from(mapa.keys());
    await ApartamentoService.getApartamentosByList(arrayMoradores)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
    });
  }

  converterDados = (lista, mapa) => {
    lista.forEach(
      morador => morador.apartamentoMorador = mapa.get(morador.apartamentoMorador)
    );
  }

  add = () => {
    window.location.href = "/gerenciar-morador/novo";
  }
  view = (id) => {
    window.location.href = `/ver-morador/${id}`;
  }
  put = (id) => {
    window.location.href = `/gerenciar-morador/${id}`;
  }

}


