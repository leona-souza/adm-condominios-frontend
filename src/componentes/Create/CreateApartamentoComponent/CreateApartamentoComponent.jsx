import React, { PureComponent } from "react";
import ApartamentoService from "../../../services/ApartamentoService";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import "./CreateApartamentoComponent.css";

class CreateApartamentoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      numero: "",
      torre: "",
      vaga: "",
      obs: ""
    };

    this.changeNumeroHandler = this.changeNumeroHandler.bind(this);
    this.changeTorreHandler = this.changeTorreHandler.bind(this);
    this.changeVagaHandler = this.changeVagaHandler.bind(this);
    this.changeObsHandler = this.changeObsHandler.bind(this);
    this.manageApartamento = this.manageApartamento.bind(this);
  }

  componentDidMount() {
    if (this.state.id === "novo") {
      return;
    } else {
      ApartamentoService.getApartamentoById(this.state.id).then((res) => {
        this.setState({
          numero: res.data.numero,
          torre: res.data.torre,
          vaga: res.data.vaga || "",
          obs: res.data.obs || ""
        });
      });
    }
  }

  changeNumeroHandler = (event) => {
    this.setState({ numero: event.target.value });
  };

  changeTorreHandler = (event) => {
    this.setState({ torre: event.target.value });
  };

  changeVagaHandler = (event) => {
    this.setState({ vaga: event.target.value });
  };

  changeObsHandler = (event) => {
    this.setState({ obs: event.target.value });
  };

  manageApartamento = (e) => {
    e.preventDefault();
    let apartamento = {
      numero: this.state.numero,
      torre: this.state.torre,
      vaga: this.state.vaga,
      obs: this.state.obs
    };
    if (this.state.id === "novo") {
      ApartamentoService.createApartamento(apartamento).then((res) => {
        this.props.history.push("/apartamentos");
      });
      this.setState({ 
        numero: "",
        torre: "",
        vaga: "",
        obs: ""
      });
    } else {
      ApartamentoService.updateApartamento(apartamento, this.state.id).then(
        (res) => {
          this.props.history.push("/apartamentos");
        }
      );
    }
  };

  cancel = () => {
    this.props.history.push("/apartamentos");
  };

  titulo = () => {
    return this.state.id === "novo"
      ? "Novo Apartamento"
      : "Alterar Apartamento";
  };

  render() {
    return (
        <div className="largura">
          <div className="titulo">{this.titulo()}</div>
            <div>
              <form className="formulario">
                <label className="formulario__label">Número</label>
                <input
                  name="numero"
                  className="formulario__input"
                  value={this.state.numero}
                  onChange={this.changeNumeroHandler}
                />
                <label className="formulario__label">Torre</label>
                <input
                  name="torre"
                  className="formulario__input"
                  value={this.state.torre}
                  onChange={this.changeTorreHandler}
                />
                <label className="formulario__label">Vaga</label>
                <input
                  name="vaga"
                  className="formulario__input"
                  value={this.state.vaga}
                  onChange={this.changeVagaHandler}
                />
                <label className="formulario__label">Obs:</label>
                <textarea
                  placeholder=""
                  name="obs"
                  className="formulario__textarea"
                  rows="5"
                  value={this.state.obs}
                  onChange={this.changeObsHandler}
                />
                <div className="formulario__botoes">
                  <div onClick={this.manageApartamento} className="botao__cursor"><SaveIcon /> Salvar</div>
                  <div onClick={this.cancel.bind(this)} className="red botao__cursor"><CancelIcon /> Cancelar</div>
                </div>
              </form>
            </div>
        </div>
    );
  }
}

export default CreateApartamentoComponent;
