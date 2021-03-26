import React, { PureComponent } from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import VeiculoService from "../../../services/VeiculoService";
import ApartamentoService from "../../../services/ApartamentoService";
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
      obs: "",
      apartamento: "",
      lista: [],
    };

    this.changeModeloHandler = this.changeModeloHandler.bind(this);
    this.changeMarcaHandler = this.changeMarcaHandler.bind(this);
    this.changePlacaHandler = this.changePlacaHandler.bind(this);
    this.changeCorHandler = this.changeCorHandler.bind(this);
    this.changeApartamentoHandler = this.changeApartamentoHandler.bind(this);
    this.changeObsHandler = this.changeObsHandler.bind(this);
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
                placa: res.data.placa,
                cor: res.data.cor,
                obs: res.data.obs,
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
  changeObsHandler = (event) => {
    this.setState({ obs: event.target.value });
  }

  manageVeiculo = (e) => {
    e.preventDefault();
    let veiculo = {
      modelo: this.state.modelo,
      marca: this.state.marca,
      placa: this.state.placa,
      cor: this.state.cor,
      obs: this.state.obs,
      apartamentoVeiculo: this.state.apartamento,
    };
    if (this.state.id === "novo") {
      VeiculoService.createVeiculo(veiculo).then((res) => {
        this.props.history.push("/veiculos");
      });
      this.setState({ 
        modelo: "",
        marca: "",
        placa: "",
        cor: "",
        obs: "",
        apartamento: ""
      });
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
      <div className="largura">
        <div className="titulo">{this.titulo()}</div>
        <div>
          <form className="formulario">
            <label className="formulario__label">Modelo</label>
              <input
                name="modelo"
                className="formulario__input"
                value={this.state.modelo}
                onChange={this.changeModeloHandler}
              />
            <label className="formulario__label">Marca</label>
              <input
                name="marca"
                className="formulario__input"
                value={this.state.marca}
                onChange={this.changeMarcaHandler}
              />
            <label className="formulario__label">Placa</label>
              <input
                name="placa"
                className="formulario__input"
                value={this.state.placa}
                onChange={this.changePlacaHandler}
              />
            <label className="formulario__label">Cor</label>
              <input
                name="cor"
                className="formulario__input"
                value={this.state.cor}
                onChange={this.changeCorHandler}
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
              <label className="formulario__label">Obs:</label>
                <textarea
                  name="obs"
                  className="formulario__textarea"
                  rows="5"
                  value={this.state.obs}
                  onChange={this.changeObsHandler}
                />
            <div className="formulario__botoes">
              <div onClick={this.manageVeiculo} className="botao__cursor"><SaveIcon /> Salvar</div>
              <div onClick={this.cancel.bind(this)} className="red botao__cursor"><CancelIcon /> Cancelar</div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateVeiculoComponent;
