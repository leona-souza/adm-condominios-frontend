import ObjectService from "../services/ObjectService";
import Functions from "../resources/Functions";
import ApartamentoService from "../services/ApartamentoService";

/***********************************************************************/
/*************************** FUNÇÕES COMUNS ****************************/
/***********************************************************************/
const funcoesComuns = {
  add: function() {
    window.location.href = "/gerenciar-apartamento/novo";
  },
  view: function(id) {
    window.location.href = `/ver-apartamento/${id}`;
  },
  put: function(id) {
    window.location.href = `/gerenciar-apartamento/${id}`;
  },
  delete: async function(id) {
    await ApartamentoService.deleteApartamento(id)
      .then(res => console.log(res.status))
      .catch(e => console.log(e));
  }
}

/***********************************************************************/
/************************* MODELO DE LISTAGEM **************************/
/***********************************************************************/
export const apartamentoModelListagem = {
  apiUrl: ObjectService.API_URL+'/apartamentos',

  coletarDados: async function(paginaAtual) {
    let paginas = {
      pagina: 1
    };
    let retorno = {
      ...funcoesComuns,
      titulo: "Lista de Apartamentos",
        adicionar: "Adicionar apartamento",
        colunasDeListagem: [
          "Apartamento",
          "Torre",
          "Vaga"
        ],
        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir o apartamento ${objeto.numero}-${objeto.torre}?`
        },
        equivalencias: new Map([
          ["numero", "Número"],
          ["torre", "Torre"],
          ["vaga", "Vaga"]
        ])
    };
    
    await ObjectService.getObjectsPaginados(paginaAtual, this.apiUrl)
      .then(res => {
        if (res.data.resultados.length > 0) {
          paginas = Functions.configurarPaginacao(paginaAtual, res.data.paginas.total);
          res.data.resultados.forEach(obj => delete obj.obs);
        }
        retorno = {
          ...retorno,
          paginas,
          valores: res.data.resultados,
        };
      })
      .catch(e => console.log(e));

    return retorno;
  }
}

/***********************************************************************/
/************************* MODELO DE DETALHES **************************/
/***********************************************************************/
export const apartamentoModelDetalhes = {
  listarMoradores: function(listaMoradores) {
    return listaMoradores?.map((morador, index) => ({
      id: morador.id,
      string: morador.nome
    }))
  },
  listarVeiculos: function(listaVeiculos) {
    return listaVeiculos?.map((veiculo, index) => ({
      id: veiculo.id,
      string: veiculo.placa
    }))
  },
  listarVisitantes: function(listaVisitantes) {
    return listaVisitantes.map((visitante, index) => ({
      id: visitante.id,
      string: visitante.nome
    }))
  },

  coletarDados: async function(id) {
    let apartamento = {};
    let moradores = [];
    let veiculos = [];
    let visitantes = [];

    await Promise.all([
      ApartamentoService.getApartamentoById(id),
      ApartamentoService.getMoradorByApartamento(id),
      ApartamentoService.getVeiculoByApartamento(id),
      ApartamentoService.getVisitanteByApartamento(id)
    ])
    .then(res => {
      apartamento = res[0].data;
      moradores = res[1].data;
      veiculos = res[2].data;
      visitantes = res[3].data;
    });

    return {
      ...funcoesComuns,
      id: apartamento.id,
      titulo: "Ver detalhes do apartamento",
      avatarCss: "fonte__apartamento",
      valorAvatar: `${apartamento.numero}-${apartamento.torre}`,
      listarTodos: "/apartamentos",

      valores: [
        { nome: "Vaga", valor: apartamento.vaga },
        { nome: "Moradores", valor: this.listarMoradores(moradores), redirect: "ver-morador" },
        { nome: "Veículos", valor: this.listarVeiculos(veiculos), redirect: "ver-veiculo" },
        { nome: "Visitantes", valor: this.listarVisitantes(visitantes), redirect: "ver-visitante" },
        { nome: "Obs", valor: apartamento.obs },
      ]
    };
  }
}

/***********************************************************************/
/************************ MODELO DE FORMULÁRIO *************************/
/***********************************************************************/
export const apartamentoModelForm = {
  coletarDados: async function(id) {
    let retorno = {};
    let valores = {};

    if (id === "novo") {
      valores = {
        numero: "",
        torre: "",
        vaga: "",
        obs: "",
        titulo: "Adicionar apartamento"
      }
    } else {
      await ApartamentoService.getApartamentoById(id)
        .then(res => {
          const { numero, torre, vaga, obs } = res.data;
          valores = {
            numero,
            torre,
            vaga,
            obs,
            titulo: "Alterar apartamento"
          }
        })
        .catch(e => console.log(e));
    }

    retorno = {
      titulo: valores.titulo,
      id,
      campos: [
        { 
          titulo: "Número", 
          cssTitulo: "formulario__label required", 
          name: "numero", 
          value: valores.numero, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Torre", 
          cssTitulo: "formulario__label required", 
          name: "torre", 
          value: valores.torre, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Vaga", 
          cssTitulo: "formulario__label", 
          name: "vaga", 
          value: valores.vaga, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
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
      enderecoVoltar: "/apartamentos",

      reestruturarObjeto: function(obj) {
        const { campos } = obj;
        return {
          id,
          numero: campos[0].value,
          torre: campos[1].value,
          vaga: campos[2].value,
          obs: campos[3].value
        };
      },
      criarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        ApartamentoService.createApartamento(objeto)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      },
      alterarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        ApartamentoService.updateApartamento(objeto, objeto.id)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      }
    }

    return retorno;
  }
}
