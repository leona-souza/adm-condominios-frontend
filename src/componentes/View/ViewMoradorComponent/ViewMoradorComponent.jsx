import React, { PureComponent } from "react";
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MoradorService from "../../../services/MoradorService";
import ApartamentoService from "../../../services/ApartamentoService";
import "./ViewMoradorComponent.css";

class ViewMoradorComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      morador: {},
    };
  }

  componentDidMount() {
    MoradorService.getMoradorById(this.state.id)
      .then(res => {
        this.setState({ morador: res.data });
      })
      .then(() => {
        this.getApartamento(this.state.morador.apartamentoMorador)
      });
  }

  getApartamento = (apartamentoId) => {
    ApartamentoService.getApartamentoById(apartamentoId)
      .then(res => {
        this.setState({ 
          morador: {
            ...this.state.morador,
            apto: res.data.numero,
            torre: res.data.torre
          }
        });
      });
  }

  listarTodos = () => {
    this.props.history.push("/moradores");
  };

  putMorador = (id, aptoId) => {
    this.props.history.push(`/gerenciar-morador/${id}`);
  };

  render() {
    return (
      <div className="largura">
        <div className="titulo">Ver detalhes do morador</div>
        <div className="caixa">
          <div className="caixa__titulo">
            <div className="titulo__icone"><PersonIcon fontSize="inherit" /></div>
            <div className="fonte__morador">{this.state.morador.nome}</div>
            <div className="detalhes__botoes botao__cursor" onClick={() => this.putMorador(this.state.morador.id)}><EditIcon />Alterar</div>
          </div>
          <div className="caixa__detalhes">
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Apartamento:</div>
              <div className="detalhes__texto">{this.state.morador?.apto}-{this.state.morador?.torre}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Telefone:</div>
              <div className="detalhes__texto">{this.state.morador?.telefone}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Documento:</div>
              <div className="detalhes__texto">{this.state.morador?.documento}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Obs:</div>
              <div className="detalhes__texto">{this.state.morador?.obs}</div>
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

export default ViewMoradorComponent;
