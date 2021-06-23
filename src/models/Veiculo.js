import ObjectService from "../services/ObjectService";
import ApartamentoService from "../services/ApartamentoService";
import Functions from "../resources/Functions";
import VeiculoService from "../services/VeiculoService";

/***********************************************************************/
/*************************** FUNÇÕES COMUNS ****************************/
/***********************************************************************/
const funcoesComuns = {
  add: function() {
    window.location.href = "/gerenciar-veiculo/novo";
  },
  view: function(id) {
    window.location.href = `/ver-veiculo/${id}`;
  },
  put: function(id) {
    window.location.href = `/gerenciar-veiculo/${id}`;
  },
  delete: async function(id) {
    await VeiculoService.deleteVeiculo(id)
      .then(res => console.log(res.status))
      .catch(e => console.log(e));
  }
}

/***********************************************************************/
/************************* MODELO DE LISTAGEM **************************/
/***********************************************************************/
export const veiculoModelListagem = {
  apiUrl: ObjectService.API_URL+'/veiculos',

  mapearVeiculos: async function(mapa, array) {
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
  },

  converterDados: function(lista, mapa) {
    lista.forEach(
      veiculo => veiculo.apartamentoVeiculo = mapa.get(veiculo.apartamentoVeiculo)
    );
  },

  coletarDados: async function(paginaAtual) {
    let retorno = [];
    let paginas = {};
    let mapaAptos = new Map();
    let listaDeVeiculos = [];

    await ObjectService.getObjectsPaginados(paginaAtual, this.apiUrl)
    .then(res => {
      ObjectService.hasZeroResults(res.data.resultados.length);
      paginas = Functions.configurarPaginacao(paginaAtual, res.data.paginas.total);
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
      retorno = { 
        ...funcoesComuns,
        paginas,

        titulo: "Lista de Veículos",
        adicionar: "Adicionar veículo",
        colunasDeListagem: [
          "Modelo",
          "Marca",
          "Cor",
          "Placa",
          "Apartamento"
        ],
        
        mensagemDeletar: function(objeto) {
          return `Deseja realmente excluir o veículo ${objeto.placa}?`
        },

        valores: listaDeVeiculos,
        equivalencias: new Map([
          ["modelo", "Modelo"],
          ["marca", "Marca"],
          ["placa", "Placa"],
          ["cor", "Cor"],
          ["apartamentoVeiculo", "Apartamento"]
        ])
      };
    })
    .catch(e => console.log(e));
    return retorno;
  }
}

/***********************************************************************/
/************************* MODELO DE DETALHES **************************/
/***********************************************************************/
export const veiculoModelDetalhes = {

  coletarDados: async function(id) {
    let veiculo = {};
    let apartamento = "";

    await VeiculoService.getVeiculoById(id)
      .then(res => veiculo = res.data)
      .catch(e => console.log(e));
    await ApartamentoService.getApartamentoById(veiculo.apartamentoVeiculo)
      .then(res => apartamento = `${res.data.numero}-${res.data.torre}`)
      .catch(e => console.log(e));

    return {
      ...funcoesComuns,
      id: veiculo.id,
      titulo: "Ver detalhes do veículo",
      avatarCss: "fonte__veiculo",
      valorAvatar: veiculo.placa,
      listarTodos: "/veiculos",

      valores: [
        { nome: "Marca", valor: veiculo.marca },
        { nome: "Modelo", valor: veiculo.modelo },
        { nome: "Cor", valor: veiculo.cor },
        { nome: "Apartamento", valor: apartamento },
        { nome: "Obs", valor: veiculo.obs }
      ]
    }
  }
}

/***********************************************************************/
/************************ MODELO DE FORMULÁRIO *************************/
/***********************************************************************/
export const veiculoModelForm = {
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
        modelo: "",
        marca: "",
        placa: "",
        cor: "",
        apartamentoVeiculo: primeiroApartamento[0].id,
        obs: "",
        titulo: "Adicionar veículo"
      }
    } else {
      await VeiculoService.getVeiculoById(id)
        .then(res => {
          const { modelo, marca, placa, cor, apartamentoVeiculo, obs  } = res.data;
          valores = {
            modelo,
            marca,
            placa,
            cor,
            apartamentoVeiculo,
            obs,
            titulo: "Alterar Veículo"
          }
        })
        .catch(e => console.log(e));
    };

    retorno = {
      titulo: valores.titulo,
      id,
      campos: [
        { 
          titulo: "Modelo", 
          cssTitulo: "formulario__label", 
          name: "modelo", 
          value: valores.modelo, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Marca", 
          cssTitulo: "formulario__label", 
          name: "marca", 
          value: valores.marca, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Placa", 
          cssTitulo: "formulario__label required", 
          name: "placa", 
          value: valores.placa, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Cor", 
          cssTitulo: "formulario__label", 
          name: "cor", 
          value: valores.cor, 
          cssInput: "formulario__input",
          placeholder: "",
          type: "text",
          tipo: "input"
        },
        { 
          titulo: "Apartamento", 
          cssTitulo: "formulario__label", 
          name: "apartamento", 
          value: valores.apartamentoVeiculo, 
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
      enderecoVoltar: "/veiculos",
      listaDeApartamentos: await listarApartamentos(),

      reestruturarObjeto: function(obj) {
        const { campos } = obj;
        const temp = {
          id,
          modelo: campos[0].value,
          marca: campos[1].value,
          placa: campos[2].value,
          cor: campos[3].value,
          apartamentoVeiculo: campos[4].value,
          obs: campos[5].value
        };
        return temp;
      },
      criarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        VeiculoService.createVeiculo(objeto)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      },
      alterarObjeto: function(obj) {
        const objeto = this.reestruturarObjeto(obj);
        VeiculoService.updateVeiculo(objeto, objeto.id)
          .then(() => window.location.href = this.enderecoVoltar)
          .catch(e => console.log(e));
      }
    }

    return retorno;
  }
}

export default {
  veiculoModelListagem,
  veiculoModelDetalhes
};
