import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

const retornoMorador = {
  apiUrl: ObjectService.API_URL+'/moradores',
  titulo: "Lista de Moradores",
  adicionar: "Adicionar morador",
  colunasDeListagem: [
    "Nome",
    "Apartamento"
  ],
  
  equivalencia: function() {
    let valores = new Map();
    valores.set("nome", "Nome");
    valores.set("documento", "Documento");
    valores.set("apartamentoMorador", "Apartamento");
    return valores;
  }(),

  mensagemDeletar: function(objeto) {
    return `Deseja realmente excluir o morador ${objeto.nome}?`
  },

  coletarDados: function(paginaAtual, setObjects) {
    let mapaAptos = new Map();
    let listaDeMoradores = [];
    
    ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
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
      setObjects({
        valores: listaDeMoradores,
        equivalencias: this.equivalencia
      });
    })
    .catch((e) => {
      console.log(e);
    });
  },

  mapearMoradores: async function(mapa, array) {
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
  },

  converterDados: function(lista, mapa) {
    lista.forEach(
      morador => morador.apartamentoMorador = mapa.get(morador.apartamentoMorador)
    );
  },

  add: function() {
    window.location.href = "/gerenciar-morador/novo";
  },

  view: function(id) {
    window.location.href = `/ver-morador/${id}`;
  },

  put: function(id) {
    window.location.href = `/gerenciar-morador/${id}`;
  }
}

export default retornoMorador;
