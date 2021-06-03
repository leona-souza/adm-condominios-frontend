import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

export default class Visitante extends ObjectService {
  constructor() {
    super();
    this.setApiUrl(process.env.REACT_APP_API_URL + "/visitantes");
    this.titulo = "Lista de Visitantes";
    this.adicionar = "Adicionar visitante";
    this.colunasDeListagem = [
        "Nome",
        "Apartamento"
      ];
  }

  mensagemDeletar = (objeto) => {
    return `Deseja realmente excluir o visitante ${objeto.nome}?`
  }

  coletarDados = (paginaAtual, thisPai) => {
    let mapaAptos = new Map();
    let listaDeVisitantes = [];
    
    this.getObjectsPaginados(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
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
      thisPai.setState({ objects: listaDeVisitantes });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  mapearVisitantes = async (mapa, array) => {
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
  }

  converterDados = (lista, mapa) => {
    lista.forEach(
      visitante => visitante.apartamentoVisitante = mapa.get(visitante.apartamentoVisitante)
    );
  }

  add = () => {
    window.location.href = "/gerenciar-visitante/novo";
  }
  view = (id) => {
    window.location.href = `/ver-visitante/${id}`;
  }
  put = (id) => {
    window.location.href = `/gerenciar-visitante/${id}`;
  }

}


