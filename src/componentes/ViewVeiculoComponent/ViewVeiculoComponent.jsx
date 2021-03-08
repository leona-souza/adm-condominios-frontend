import React, { PureComponent } from "react";
import VeiculoService from "../../services/VeiculoService";
import ApartamentoService from "../../services/ApartamentoService";
import "./ViewVeiculoComponent.css";

class ViewVeiculoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      veiculo: {},
    };
  }

  componentDidMount() {
    /*MoradorService.getMoradorById(this.state.id).then((res) => {
      this.setState({ morador: res.data });
    });*/

    VeiculoService.getVeiculoById(this.state.id)
      .then(async (res) => {
        await ApartamentoService.getApartamentoById(res.data.apartamentoVeiculo).then(
          (dados) => {
            this.setState({
              veiculo: {
                ...res.data,
                apto: dados.data.numero,
                torre: dados.data.torre,
              },
            });
          }
        );
      });
  }

  listarTodos = () => {
    this.props.history.push("/veiculos");
  };

  async findVeiculos(apartamentoId) {
    await ApartamentoService.getApartamentoByVeiculo(apartamentoId).then(
      (resposta) =>
        this.setState({
          info: {
            numero: resposta.data.numero,
            torre: resposta.data.torre,
          },
        })
    );
  }

  render() {
    return (
      <div>
        <div className="card col-md-8 offset-md-2 viewApartamento__card">
          <h3>Ver detalhes do veículo</h3>
          <div className="card-body">
            <div className="row">
              <strong>Modelo:</strong>
              <div className="divisor" />
              <div>{this.state.veiculo.modelo}</div>
            </div>
            <div className="row">
              <strong>Marca:</strong>
              <div className="divisor" />
              <div>{this.state.veiculo.marca}</div>
            </div>
            <div className="row">
              <strong>Cor:</strong>
              <div className="divisor" />
              <div>{this.state.veiculo.cor}</div>
            </div>
            <div className="row">
              <strong>Placa:</strong>
              <div className="divisor" />
              <div>{this.state.veiculo.placa}</div>
            </div>
            <div className="row">
              <strong>Apto:</strong>
              <div className="divisor" />
              <div>
                {this.state.veiculo.apto} - {this.state.veiculo.torre}
              </div>
            </div>
            <button className="btn btn-info" onClick={this.listarTodos}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewVeiculoComponent;
