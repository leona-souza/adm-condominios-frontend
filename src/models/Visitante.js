import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

const retornoVisitante = {
  apiUrl: process.env.REACT_APP_API_URL + "/visitantes",
  titulo: "Lista de Visitantes",
  adicionar: "Adicionar visitante",
  colunasDeListagem: [
    "Nome",
    "Apartamento"
  ],

  mensagemDeletar: function(objeto) {
    return `Deseja realmente excluir o visitante ${objeto.nome}?`
  },

  coletarDados: function(paginaAtual, setObjects) {
    let mapaAptos = new Map();
    let listaDeVisitantes = [];
    
    ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);

      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => {
        const { id, nome, apartamentoVisitante } = obj;
        listaDeVisitantes.push({ id, nome, apartamentoVisitante });
      })
    })
    .then(async () => { 
       await this.mapearVisitantes(mapaAptos, listaDeVisitantes);
    })
    .then(() => {
      this.converterDados(listaDeVisitantes, mapaAptos);
    })
    .then(() => {
      setObjects({
        valores: listaDeVisitantes,
        equivalencias: new Map([
          ["nome", "Nome"],
          ["apartamentoVisitante", "Apartamento"]
        ])
      });
    })
    .catch((e) => {
      console.log(e);
    });
  },

  mapearVisitantes: async function(mapa, array) {
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
  },

  converterDados: function(lista, mapa) {
    lista.forEach(
      visitante => visitante.apartamentoVisitante = mapa.get(visitante.apartamentoVisitante)
    );
  },

  add: function() {
    window.location.href = "/gerenciar-visitante/novo";
  },

  view: function(id) {
    window.location.href = `/ver-visitante/${id}`;
  },

  put: function(id) {
    window.location.href = `/gerenciar-visitante/${id}`;
  }

}

export default retornoVisitante;
