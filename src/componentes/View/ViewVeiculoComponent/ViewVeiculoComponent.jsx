import React, { PureComponent } from "react";
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import VeiculoService from "../../../services/VeiculoService";
import ApartamentoService from "../../../services/ApartamentoService";
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

  putVeiculo = (id) => {
    this.props.history.push(`/gerenciar-veiculo/${id}`);
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
      <div className="largura">
        <div className="titulo">Ver detalhes do veículo</div>
        <div className="caixa">
          <div className="caixa__titulo">
            <div className="titulo__icone"><DriveEtaIcon fontSize="inherit" /></div>
            <div className="fonte__veiculo">{this.state.veiculo.placa}</div>
            <div className="detalhes__botoes botao__cursor" onClick={() => this.putVeiculo(this.state.veiculo.id)}><EditIcon />Alterar</div>
          </div>
          <div className="caixa__detalhes">
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Marca:</div>
              <div className="detalhes__texto">{this.state.veiculo?.marca}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Modelo:</div>
              <div className="detalhes__texto">{this.state.veiculo?.modelo}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Cor:</div>
              <div className="detalhes__texto">{this.state.veiculo?.cor}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Apartamento:</div>
              <div className="detalhes__texto">{this.state.veiculo?.apto}-{this.state.veiculo?.torre}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Obs:</div>
              <div className="detalhes__texto">{this.state.veiculo?.obs}</div>
            </div>
          </div>
        </div>
        <div className="detalhes__botoes botao__cursor" onClick={this.listarTodos}>
          <ArrowBackIosIcon /> Voltar
        </div>
      </div>
    );
  }
}

export default ViewVeiculoComponent;
