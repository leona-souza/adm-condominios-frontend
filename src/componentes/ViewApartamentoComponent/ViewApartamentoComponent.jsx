import React, { PureComponent } from "react";
import ApartamentoService from "../../services/ApartamentoService";
import "./ViewApartamentoComponent.css";

class ViewApartamentoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      apartamento: {},
      moradores: [],
    };
  }

  componentDidMount() {
    ApartamentoService.getApartamentoById(this.state.id).then(res => {
      this.setState({ apartamento: res.data });
    });
    ApartamentoService.getMoradorByApartamento(this.state.id).then(res => {
      this.setState({ moradores: res.data });
    });
    ApartamentoService.getVeiculoByApartamento(this.state.id).then(res => {
      this.setState({ veiculos: res.data });
    });
  }

  listarTodos = () => {
    this.props.history.push("/apartamentos");
  };

  listarMoradores = (listaMoradores) => {
    return listaMoradores?.map(
      (morador, index) => (index ? ", " : "") + morador.nome
    )
  }

  listarVeiculos = (listaVeiculos) => {
    return listaVeiculos?.map(
      (veiculo, index) => (index ? ", " : "") + veiculo.placa
    )
  }

  render() {
    return (
      <div>
        <div className="card col-md-6 offset-md-3 viewApartamento__card">
          <h3>Ver detalhes do apartamento</h3>
          <div className="card-body">
            <div className="row">
              <strong>Número:</strong>
              <div className="divisor" />
              <div>{this.state.apartamento.numero}</div>
            </div>
            <div className="row">
              <strong>Torre:</strong>
              <div className="divisor" />
              <div>{this.state.apartamento.torre}</div>
            </div>
            <div className="row">
              <strong>Vaga:</strong>
              <div className="divisor" />
              <div>{this.state.apartamento.vaga}</div>
            </div>
            <div className="row">
              <strong>Moradores:</strong>
              <div className="divisor" />
              <div>
                {this.listarMoradores(this.state.moradores)}
              </div>
            </div>
            <div className="row">
              <strong>Veículos:</strong>
              <div className="divisor" />
              <div>
                {this.listarVeiculos(this.state.veiculos)}
              </div>
            </div>
            <div className="viewapartamento__botaovoltar">
              <button className="btn btn-info" onClick={this.listarTodos}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewApartamentoComponent;
