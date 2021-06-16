import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import MoradorService from "../services/MoradorService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

/**********************/
/*** FUNÇÕES COMUNS ***/
/**********************/
const funcoesComuns = {
  add: function() {
    window.location.href = "/gerenciar-morador/novo";
  },
  view: function(id) {
    window.location.href = `/ver-morador/${id}`;
  },
  put: function(id) {
    window.location.href = `/gerenciar-morador/${id}`;
  },
  delete: async function(id) {
    await MoradorService.deleteMorador(id)
      .then(res => console.log(res.status))
      .catch(e => console.log(e));
  }
}

/***********************************************************************/
/************************* MODELO DE LISTAGEM **************************/
/***********************************************************************/
export const moradorModelListagem = {
  apiUrl: ObjectService.API_URL+'/moradores',

  mapearMoradores: async function(mapa, array) {
    array.forEach(dado => mapa.set(dado.apartamentoMorador, ""));
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

  coletarDados: async function(paginaAtual) {
    let retorno = [];
    let mapaAptos = new Map();
    let listaDeMoradores = [];
    
    await ObjectService.getObjectsPaginados(paginaAtual, LIMITE, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      //Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => {
        const { id, nome, apartamentoMorador } = obj;
        listaDeMoradores.push({ id, nome, apartamentoMorador });
      })

    })
    .then(async () => { 
       await this.mapearMoradores(mapaAptos, listaDeMoradores);
    })
    .then(() => {
      this.converterDados(listaDeMoradores, mapaAptos);
    })
    .then(() => {
      retorno = {
        ...funcoesComuns,
        titulo: "Lista de Moradores",
        adicionar: "Adicionar morador",
        colunasDeListagem: [
          "Nome",
          "Apartamento"
        ],

        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir o morador ${objeto.nome}?`
        },

        valores: listaDeMoradores,
        equivalencias: new Map([
          ["nome", "Nome"],
          ["documento", "Documento"],
          ["apartamentoMorador", "Apartamento"]
        ])
      };
    })
    .catch(e => console.log(e));
    return retorno;
  }
}

/***********************************************************************/
/************************ MODELO DE DETALHES *************************/
/***********************************************************************/
export const moradorModelDetalhes = {
  coletarDados: async function(id) {
    let morador = {};
    let apartamento = {};

    await MoradorService.getMoradorById(id)
      .then(res => morador = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getApartamentoById(morador.apartamentoMorador)
      .then(res => apartamento = `${res.data.numero}-${res.data.torre}`)
      .catch(e => console.log(e));

    return {
      ...funcoesComuns,
      id: morador.id,
      titulo: "Ver detalhes do morador",
      avatarCss: "fonte__visitante",
      valorAvatar: morador.nome,
      listarTodos:"/moradores",
      
      valores: [
        { nome: "Apartamento", valor: apartamento },
        { nome: "Telefone", valor: morador.telefone },
        { nome: "Documento", valor: morador.documento },
        { nome: "Obs", valor: morador.obs }
      ]
    };
  }
}

/***********************************************************************/
/************************ MODELO DE FORMULÁRIO *************************/
/***********************************************************************/
export const moradorModelForm = {
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
        apartamentoMorador: primeiroApartamento[0].id,
        obs: "",
        titulo: "Adicionar morador"
      }
    } else {
      await MoradorService.getMoradorById(id)
        .then(res => {
          const { nome, telefone, documento, apartamentoMorador, obs  } = res.data;
          valores = {
            nome,
            telefone,
            documento,
            apartamentoMorador,
            obs,
            titulo: "Alterar morador"
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
          tipo: "input"
        },
        { 
          titulo: "Telefone", 
          cssTitulo: "formulario__label", 
          name: "telefone", 
          value: valores.telefone, 
          cssInput: "formulario__input",
          placeholder: "",
          tipo: "input"
        },
        { 
          titulo: "Documento", 
          cssTitulo: "formulario__label", 
          name: "documento", 
          value: valores.documento, 
          cssInput: "formulario__input",
          placeholder: "",
          tipo: "input"
        },
        { 
          titulo: "Apartamento", 
          cssTitulo: "formulario__label", 
          name: "apartamento", 
          value: valores.apartamentoMorador, 
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
      enderecoVoltar: "/moradores",
      listaDeApartamentos: await listarApartamentos(),

      reestruturarObjeto: function(obj) {
        const { campos } = obj;
        const temp = {
          id,
          nome: campos[0].value,
          telefone: campos[1].value,
          documento: campos[2].value,
          apartamentoMorador: campos[3].value,
          obs: campos[4].value
        };
        return temp;
      },
      criarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        MoradorService.createMorador(objeto)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      },
      alterarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        MoradorService.updateMorador(objeto, objeto.id)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      }
    }

    return retorno;
  }
}

export default {
  moradorModelListagem,
  moradorModelDetalhes,
  moradorModelForm
};
