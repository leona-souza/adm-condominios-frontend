import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import VisitanteService from "../services/VisitanteService";
import VisitaService from "../services/VisitaService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

export default class Visita extends ObjectService {
  constructor() {
    super();
    this.setApiUrl(process.env.REACT_APP_API_URL + "/visitas");
    this.titulo = "Lista de Visitas";
    this.adicionar = "Adicionar visita";
    this.colunasDeListagem = [
        "Data",
        "Visitante",
        "Apartamento"
      ];
  }

  mensagemDeletar = (objeto) => {
    return `Deseja realmente excluir a visita ${objeto.data}?`
  }

  coletarDados = (paginaAtual, thisPai) => {
    let mapaAptos = new Map();
    let mapaNomes = new Map();
    let listaDeVisitas = [];

    VisitaService.getVisitasPaginadas(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
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
      thisPai.setState({ objects: listaDeVisitas });
    })
    .catch((e) => {
      console.log(e);
    });  
  }

  mapearApartamentos = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.apartamento, "");
    });
    const arrayApartamentos = Array.from(mapa.keys());
    if (arrayApartamentos[0]) {
      await ApartamentoService.getApartamentosByList(arrayApartamentos)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
      });
    }
  }

  mapearVisitantes = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.visitante, "");
    });
    const arrayVisitantes = Array.from(mapa.keys());
    await VisitanteService.getVisitantesByList(arrayVisitantes)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.nome);
        });    
    });
  }

  converterDados = (array, mapaAptos, mapaNomes) => {
    for (const key in array) {
      const nome = mapaNomes.get(array[key].visitante);
      const apto = mapaAptos.get(array[key].apartamento);
      array[key].visitante = nome;
      array[key].apartamento = apto;
      array[key].data = Functions.dataFromDbToScreen(array[key].data);
    };
  }

  add = () => {
    window.location.href = "/gerenciar-visita/novo";
  }
  view = (id) => {
    window.location.href = `/ver-visita/${id}`;
  }
  put = (id) => {
    window.location.href = `/gerenciar-visita/${id}`;
  }

}

