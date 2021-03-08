import React, { PureComponent } from "react";
import VeiculoService from "../../services/VeiculoService";
import ApartamentoService from "../../services/ApartamentoService";
import "./CreateVeiculoComponent.css";

class CreateVeiculoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      modelo: "",
      marca: "",
      placa: "",
      cor: "",
      apartamento: "",
      lista: [],
    };

    this.changeModeloHandler = this.changeModeloHandler.bind(this);
    this.changeMarcaHandler = this.changeMarcaHandler.bind(this);
    this.changePlacaHandler = this.changePlacaHandler.bind(this);
    this.changeCorHandler = this.changeCorHandler.bind(this);
    this.changeApartamentoHandler = this.changeApartamentoHandler.bind(this);
    this.manageVeiculo = this.manageVeiculo.bind(this);
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
          VeiculoService.getVeiculoById(this.state.id)
            .then((res) => {
              this.setState({
                modelo: res.data.modelo,
                marca: res.data.marca,
                placa: res.data.placa || "",
                cor: res.data.cor,
                apartamento: res.data.apartamentoVeiculo
              });
            });
        }
      });


  }

  changeModeloHandler = (event) => {
    this.setState({ modelo: event.target.value });
  };

  changeMarcaHandler = (event) => {
    this.setState({ marca: event.target.value });
  };

  changePlacaHandler = (event) => {
    this.setState({ placa: event.target.value });
  };

  changeCorHandler = (event) => {
    this.setState({ cor: event.target.value });
  };

  changeApartamentoHandler = (event) => {
    this.setState({ apartamento: event.target.value });
  };

  manageVeiculo = (e) => {
    e.preventDefault();
    let veiculo = {
      modelo: this.state.modelo,
      marca: this.state.marca,
      placa: this.state.placa,
      cor: this.state.cor,
      apartamentoVeiculo: this.state.apartamento,
    };
    if (this.state.id === "novo") {
      VeiculoService.createVeiculo(veiculo).then((res) => {
        this.props.history.push("/veiculos");
      });
      this.setState({ modelo: "" });
      this.setState({ marca: "" });
      this.setState({ placa: "" });
      this.setState({ cor: "" });
      this.setState({ apartamento: "" });
    } else {
      VeiculoService.updateVeiculo(veiculo, this.state.id).then((res) => {
        this.props.history.push("/veiculos");
      });
    }
  };

  cancel = () => {
    this.props.history.push("/veiculos");
  };

  titulo = () => {
    return this.state.id === "novo" ? "Novo Veículo" : "Alterar Veículo";
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
                    <label>Modelo</label>
                    <input
                      placeholder="Modelo"
                      name="modelo"
                      className="form-control"
                      value={this.state.modelo}
                      onChange={this.changeModeloHandler}
                    />
                    <label>Marca</label>
                    <input
                      placeholder="Marca"
                      name="marca"
                      className="form-control"
                      value={this.state.marca}
                      onChange={this.changeMarcaHandler}
                    />
                    <label>Placa</label>
                    <input
                      placeholder="Placa"
                      name="placa"
                      className="form-control"
                      value={this.state.placa}
                      onChange={this.changePlacaHandler}
                    />
                    <label>Cor</label>
                    <input
                      placeholder="Cor"
                      name="cor"
                      className="form-control"
                      value={this.state.cor}
                      onChange={this.changeCorHandler}
                    />
                    <label>Apartamento</label>
                    <select
                      name="apartamento"
                      className="form-control"
                      value={this.state.apartamento}
                      onChange={this.changeApartamentoHandler}
                    >
                      {this.state.lista.map((dados) => {
                        return (
                          <option key={dados.aptoId} value={dados.aptoId}>
                            {dados.numero}-{dados.torre}
                          </option>
                        );
                      })}
                    </select>
                    <div className="createMorador__botoes">
                      <button
                        className="btn btn-success"
                        onClick={this.manageVeiculo}
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

export default CreateVeiculoComponent;
