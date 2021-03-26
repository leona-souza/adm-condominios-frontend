import React, { PureComponent } from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import VisitanteService from "../../../services/VisitanteService";
import ApartamentoService from "../../../services/ApartamentoService";
import "./CreateVisitanteComponent.css";

class CreateVisitanteComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      nome: "",
      documento: "",
      telefone: "",
      apartamento: "",
      obs: "",
      lista: [],
    };

    this.changeNomeHandler = this.changeNomeHandler.bind(this);
    this.changeDocumentoHandler = this.changeDocumentoHandler.bind(this);
    this.changeTelefoneHandler = this.changeTelefoneHandler.bind(this);
    this.changeApartamentoHandler = this.changeApartamentoHandler.bind(this);
    this.changeObsHandler = this.changeObsHandler.bind(this);
    this.manageVisitante = this.manageVisitante.bind(this);
  }

  componentDidMount() {
    ApartamentoService.getApartamentos()
      .then((resposta) => {
        resposta.data.map((dado) => {
          return this.setState({
            lista: [
              ...this.state.lista,
              { aptoId: dado.id, numero: dado.numero, torre: dado.torre },
            ],
          });
        });
      })
      .then(() => {
        if (this.state.id === "novo") {
          this.setState({ apartamento: this.state.lista[0].aptoId });
          return;
        } else {
          VisitanteService.getVisitanteById(this.state.id)
            .then(res => {
              this.setState({
                nome: res.data.nome,
                documento: res.data.documento || "",
                telefone: res.data.telefone || "",
                obs: res.data.obs || "",
                apartamento: res.data.apartamentoVisitante
              });
            });
        }
      });

  }

  changeNomeHandler = (event) => {
    this.setState({ nome: event.target.value });
  };
  changeDocumentoHandler = (event) => {
    this.setState({ documento: event.target.value });
  };
  changeTelefoneHandler = (event) => {
    this.setState({ telefone: event.target.value });
  };
  changeApartamentoHandler = (event) => {
    this.setState({ apartamento: event.target.value });
  };
  changeObsHandler = (event) => {
    this.setState({ obs: event.target.value });
  }

  manageVisitante = (e) => {
    e.preventDefault();
    let visitante = {
      nome: this.state.nome,
      documento: this.state.documento,
      telefone: this.state.telefone,
      obs: this.state.obs,
      apartamentoVisitante: this.state.apartamento,
    };
    if (this.state.id === "novo") {
      VisitanteService.createVisitante(visitante).then(() => {
        this.cancel();
      });
    } else {
      VisitanteService.updateVisitante(visitante, this.state.id).then(() => {
        this.cancel();
      });
    }
  };

  cancel = () => {
    this.props.history.push("/visitantes");
  };

  titulo = () => {
    return this.state.id === "novo" ? "Novo Visitante" : "Alterar Visitante";
  };

  render() {
    return (
      <div className="largura">
        <div className="titulo">{this.titulo()}</div>
          <form className="formulario">
            <label className="formulario__label">Nome</label>
              <input
                name="nome"
                className="formulario__input"
                value={this.state.nome}
                onChange={this.changeNomeHandler}
              />
            <label className="formulario__label">Documento</label>
              <input
                name="documento"
                className="formulario__input"
                value={this.state.documento}
                onChange={this.changeDocumentoHandler}
              />
            <label className="formulario__label">Telefone</label>
              <input
                name="telefone"
                className="formulario__input"
                value={this.state.telefone}
                onChange={this.changeTelefoneHandler}
              />
            <label className="formulario__label">Apartamento</label>
              <select
                name="apartamento"
                className="formulario__input"
                value={this.state.apartamento}
                onChange={this.changeApartamentoHandler}
              >
                {this.state.lista.map(dados => {
                  return (
                    <option key={dados.aptoId} value={dados.aptoId}>
                      {dados.numero}-{dados.torre}
                    </option>
                  );
                })}
              </select>
            <label className="formulario__label">Obs</label>
              <textarea
                name="obs"
                className="formulario__textarea"
                value={this.state.obs}
                onChange={this.changeObsHandler}
              />

              <div className="formulario__botoes">
                <div onClick={this.manageVisitante} className="botao__cursor"><SaveIcon /> Salvar</div>
                <div onClick={this.cancel.bind(this)} className="red botao__cursor"><CancelIcon /> Cancelar</div>
              </div>
          </form>
      </div>
    );
  }
}

export default CreateVisitanteComponent;
