import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import VisitanteService from "../services/VisitanteService";
import VisitaService from "../services/VisitaService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

const retornoVisita = {
  apiUrl: process.env.REACT_APP_API_URL + "/visitas",
  titulo: "Lista de Visitas",
  adicionar: "Adicionar visita",
  colunasDeListagem: [
    "Data",
    "Visitante",
    "Apartamento"
  ],

  equivalencia: function() {
    let valores = new Map();
    valores.set("data", "Data");
    valores.set("nome", "Nome");
    valores.set("apartamentoVisitante", "Apartamento");
    return valores;
  }(),

  mensagemDeletar: function(objeto) {
    return `Deseja realmente excluir a visita ${objeto.data}?`
  },

  coletarDados: function(paginaAtual, setObjects) {
    let mapaAptos = new Map();
    let mapaNomes = new Map();
    let listaDeVisitas = [];

    VisitaService.getVisitasPaginadas(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
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
      setObjects({
        valores: listaDeVisitas,
        equivalencias: this.equivalencia
      })
    })
    .catch((e) => {
      console.log(e);
    });  
  },

  mapearApartamentos: async function(mapa, array) {
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
  },

  mapearVisitantes: async function(mapa, array) {
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

export default retornoVisita;