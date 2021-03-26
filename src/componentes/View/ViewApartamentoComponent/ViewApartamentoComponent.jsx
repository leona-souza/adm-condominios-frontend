import React, { PureComponent } from "react";
import ApartamentoService from "../../../services/ApartamentoService";
import ApartmentIcon from '@material-ui/icons/Apartment';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import "./ViewApartamentoComponent.css";

class ViewApartamentoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      apartamento: {},
      moradores: [],
      visitantes: []
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
    ApartamentoService.getVisitanteByApartamento(this.state.id).then(res => {
      this.setState({ visitantes: res.data });
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
  listarVisitantes = (listaVisitantes) => {
    return listaVisitantes?.map(
      (visitante, index) => (index ? ", " : "") + visitante.nome
    )
  }
  putApartamento = (id) => {
    this.props.history.push(`/gerenciar-apartamento/${id}`);
  };

  render() {
    return (
      <div className="largura">
        <div className="titulo">Ver detalhes do apartamento</div>
        <div className="caixa">
          <div className="caixa__titulo">
            <div className="titulo__icone"><ApartmentIcon fontSize="inherit" /></div>
            <div className="fonte__apartamento">{this.state.apartamento.numero}-{this.state.apartamento.torre}</div>
            <div className="detalhes__botoes botao__cursor" onClick={() => this.putApartamento(this.state.apartamento.id)}><EditIcon />Alterar</div>
          </div>
          <div className="caixa__detalhes">
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Vaga:</div>
              <div className="detalhes__texto">{this.state.apartamento.vaga}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Moradores:</div>
              <div className="detalhes__texto">{this.listarMoradores(this.state.moradores)}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Veículos:</div>
              <div className="detalhes__texto">{this.listarVeiculos(this.state.veiculos)}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Visitantes:</div>
              <div className="detalhes__texto">{this.listarVisitantes(this.state.visitantes)}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Obs:</div>
              <div className="detalhes__texto">{this.state.apartamento.obs}</div>
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

export default ViewApartamentoComponent;
