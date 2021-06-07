import ObjectService from "../services/ObjectService";
import Functions from "../resources/Functions";
import { LIMITE } from "../resources/Config";

export default function Apartamento(props) {

    //this.setApiUrl(process.env.REACT_APP_API_URL + "/apartamentos");
    const titulo = "Lista de Apartamentos";
    const adicionar = "Adicionar apartamento";   
    const colunasDeListagem = [
      "Apartamento",
      "Torre",
      "Vaga"
    ];
    this.equivalencia = new Map();
    this.equivalencia.set("numero", "Número");
    this.equivalencia.set("torre", "Torre");
    this.equivalencia.set("vaga", "Vaga");


  mensagemDeletar = (objeto) => {
    return `Deseja realmente excluir o apartamento ${objeto.numero}-${objeto.torre}?`
  }

  coletarDados = (paginaAtual, thisPai) => {
    this.getObjectsPaginados(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, thisPai);
      res.data.resultados.forEach(obj => delete obj.obs);
      thisPai.setState({
        objects: res.data.resultados,
        equivalencias: this.equivalencia
      });
    })
    .catch(e => console.log(e));
  }

  add = () => {
    window.location.href = "/gerenciar-apartamento/novo";
  }
  view = (id) => {
    window.location.href = `/ver-apartamento/${id}`;
  }
  put = (id) => {
    window.location.href = `/gerenciar-apartamento/${id}`;
  }

}


