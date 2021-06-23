import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import VisitanteService from "../services/VisitanteService";

/***********************************************************************/
/*************************** FUNÇÕES COMUNS ****************************/
/***********************************************************************/
const funcoesComuns = {
  add: function() {
    window.location.href = "/gerenciar-visitante/novo";
  },
  view: function(id) {
    window.location.href = `/ver-visitante/${id}`;
  },
  put: function(id) {
    window.location.href = `/gerenciar-visitante/${id}`;
  },
  delete: async function(id) {
    await VisitanteService.deleteVisitante(id)
      .then(res => console.log(res.status))
      .catch(e => console.log(e));
  }
}

/***********************************************************************/
/************************* MODELO DE LISTAGEM **************************/
/***********************************************************************/
export const visitanteModelListagem = {
  apiUrl: process.env.REACT_APP_API_URL + "/visitantes",

  mapearVisitantes: async function(mapa, array) {
    array.forEach(dado => mapa.set(dado.apartamentoVisitante, ""));
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

  coletarDados: async function(paginaAtual) {
    let mapaAptos = new Map();
    let listaDeVisitantes = [];
    let paginas = {
      pagina: 1
    };
    let retorno = {
      ...funcoesComuns,
      titulo: "Lista de Visitantes",
        adicionar: "Adicionar visitante",
        colunasDeListagem: [
          "Nome",
          "Apartamento"
        ],
        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir o visitante ${objeto.nome}?`
        },
        equivalencias: new Map([
          ["nome", "Nome"],
          ["apartamentoVisitante", "Apartamento"]
        ])
    };
    
    await ObjectService.getObjectsPaginados(paginaAtual, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      paginas = Functions.configurarPaginacao(paginaAtual, res.data.paginas.total);
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
      retorno = {
        ...retorno,
        paginas,
        valores: listaDeVisitantes,
      }
    })
    .catch(e => console.log(e));
    return retorno;
  }
}

/***********************************************************************/
/************************* MODELO DE DETALHES **************************/
/***********************************************************************/
export const visitanteModelDetalhes = {
  coletarDados: async function(id) {
    let visitante = {};
    let apartamento = "";

    await VisitanteService.getVisitanteById(id)
      .then(res => visitante = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getApartamentoById(visitante.apartamentoVisitante)
      .then(res => apartamento = `${res.data.numero}-${res.data.torre}`)
      .catch(e => console.log(e));

    return {
      ...funcoesComuns,
      id: visitante.id,
      titulo: "Ver detalhes do visitante",
      avatarCss: "fonte__visitante",
      valorAvatar: visitante.nome,
      listarTodos:"/visitantes",

      valores: [
        { nome: "Apartamento", valor: apartamento },
        { nome: "Telefone", valor: visitante.telefone },
        { nome: "Documento", valor: visitante.documento },
        { nome: "Obs", valor: visitante.obs },
      ]
    }
  }
}

/***********************************************************************/
/************************ MODELO DE FORMULÁRIO *************************/
/***********************************************************************/
export const visitanteModelForm = {
  coletarDados: async function(id) {
    let retorno = {};
    let valores = {};

    const listarApartamentos = async () => {
      let temp = [];
      await ApartamentoService.getApartamentos()
        .then(res => temp = res.data.resultados)
        .catch(e => console.log(e));
      return temp;
    };

    if (id === "novo") {
      const primeiroApartamento = await listarApartamentos();
      valores = {
        nome: "",
        documento: "",
        telefone: "",
        apartamentoVisitante: primeiroApartamento[0].id,
        obs: "",
        titulo: "Adicionar visitante"
      }
    } else {
      await VisitanteService.getVisitanteById(id)
        .then(res => {
          const { nome, telefone, documento, apartamentoVisitante, obs  } = res.data;
          valores = {
            nome,
            telefone,
            documento,
            apartamentoVisitante,
            obs,
            titulo: "Alterar visitante"
          }
        })
        .catch(e => console.log(e));
    };

    retorno = {
      titulo: valores.titulo,
      id,
      campos: [
        { 
          titulo: "Nome", 
          cssTitulo: "formulario__label required", 
          name: "nome", 
          value: valores.nome, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Telefone", 
          cssTitulo: "formulario__label", 
          name: "telefone", 
          value: valores.telefone, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Documento", 
          cssTitulo: "formulario__label", 
          name: "documento", 
          value: valores.documento, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Apartamento", 
          cssTitulo: "formulario__label", 
          name: "apartamento", 
          value: valores.apartamentoVisitante, 
          cssInput: "formulario__input",
          placeholder: "",
          tipo: "select"
        },
        { 
          titulo: "Obs", 
          cssTitulo: "formulario__label", 
          name: "obs", 
          value: valores.obs, 
          cssInput: "formulario__textarea",
          placeholder: "",
          rows: 5,
          tipo: "textarea"
        }
      ],
      enderecoVoltar: "/visitantes",
      listaDeApartamentos: await listarApartamentos(),

      reestruturarObjeto: function(obj) {
        const { campos } = obj;
        const temp = {
          id,
          nome: campos[0].value,
          telefone: campos[1].value,
          documento: campos[2].value,
          apartamentoVisitante: campos[3].value,
          obs: campos[4].value
        };
        return temp;
      },
      criarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        VisitanteService.createVisitante(objeto)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      },
      alterarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        VisitanteService.updateVisitante(objeto, objeto.id)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      }
    }

    return retorno;
  }
}

export default {
  visitanteModelListagem,
  visitanteModelDetalhes,
  visitanteModelForm
};
