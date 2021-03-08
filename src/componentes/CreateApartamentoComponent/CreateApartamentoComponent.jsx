import React, { PureComponent } from "react";
import ApartamentoService from "../../services/ApartamentoService";
import "./CreateApartamentoComponent.css";

class CreateApartamentoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      numero: "",
      torre: "",
      vaga: "",
    };

    this.changeNumeroHandler = this.changeNumeroHandler.bind(this);
    this.changeTorreHandler = this.changeTorreHandler.bind(this);
    this.changeVagaHandler = this.changeVagaHandler.bind(this);
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

  manageApartamento = (e) => {
    e.preventDefault();
    let apartamento = {
      numero: this.state.numero,
      torre: this.state.torre,
      vaga: this.state.vaga,
    };
    if (this.state.id === "novo") {
      ApartamentoService.createApartamento(apartamento).then((res) => {
        this.props.history.push("/apartamentos");
      });
      this.setState({ numero: "" });
      this.setState({ torre: "" });
      this.setState({ vaga: "" });
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
      <div>
        <div className="container">
          <div className="row">
            <div className="card col-md-6 offset-md-3 margemCard">
              <h3 className="text-center">{this.titulo()}</h3>
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label>Número</label>
                    <input
                      placeholder="Número"
                      name="numero"
                      className="form-control"
                      value={this.state.numero}
                      onChange={this.changeNumeroHandler}
                    />
                    <label>Torre</label>
                    <input
                      placeholder="Torre"
                      name="torre"
                      className="form-control"
                      value={this.state.torre}
                      onChange={this.changeTorreHandler}
                    />
                    <label>Vaga</label>
                    <input
                      placeholder="Vaga"
                      name="vaga"
                      className="form-control"
                      value={this.state.vaga}
                      onChange={this.changeVagaHandler}
                    />
                    <div className="createApartamento__botoes">
                      <button
                        className="btn btn-success"
                        onClick={this.manageApartamento}
                      >
                        Salvar
                      </button>
                      <div className="divisor" />
                      <button
                        className="btn btn-danger"
                        onClick={this.cancel.bind(this)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateApartamentoComponent;
