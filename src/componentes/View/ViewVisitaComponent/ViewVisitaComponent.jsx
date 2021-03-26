import React, { PureComponent } from "react";
import EventIcon from '@material-ui/icons/Event';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import VisitaService from "../../../services/VisitaService";
import VisitanteService from "../../../services/VisitanteService";
import ApartamentoService from "../../../services/ApartamentoService";
import Functions from "../../../resources/Functions";
import "./ViewVisitaComponent.css";

class ViewVisitaComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      visita: {},
    };
  }

  componentDidMount() {
    VisitaService.getVisitaById(this.state.id)
      .then(res => { 
        this.setState({ visita: res.data });
      })
      .then(() => {
        this.getApartamento(this.state.visita.apartamento);
        this.getVisitante(this.state.visita.visitante);
      });
  }

  getVisitante = (visitanteId) => {
    VisitanteService.getVisitanteById(visitanteId)
      .then(res => {
        this.setState({ 
          visita: { 
            ...this.state.visita,
           visitante: res.data.nome 
          } 
        });
      });
  }

  getApartamento = (apartamentoId) => {
    ApartamentoService.getApartamentoById(apartamentoId)
      .then(res => {
        this.setState({ 
          visita: {
            ...this.state.visita,
            apto: res.data.numero,
            torre: res.data.torre
          }
         });
      });
  }

  listarTodos = () => {
    this.props.history.push("/visitas");
  };
  putVisita = (id) => {
    this.props.history.push(`/gerenciar-visita/${id}`);
  };

  render() {
    return (
      <div className="largura">
        <div className="titulo">Ver detalhes da visita</div>
        <div className="caixa">
        <div className="caixa__titulo">
            <div className="titulo__icone"><EventIcon fontSize="inherit" /></div>
            <div className="fonte__veiculo">{Functions.dataFromDbToScreen(this.state.visita.data)}</div>
            <div className="detalhes__botoes botao__cursor" onClick={() => this.putVisita(this.state.visita.id)}><EditIcon />Alterar</div>
          </div>
          <div className="caixa__detalhes">
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Visitante:</div>
              <div className="detalhes__texto">{this.state.visita?.visitante}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Apartamento:</div>
              <div className="detalhes__texto">{this.state.visita?.apto +"-"+ this.state.visita?.torre}</div>
            </div>
            <div className="detalhes__linha">
              <div className="detalhes__titulo">Obs:</div>
              <div className="detalhes__texto">{this.state.visita?.obs}</div>
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

export default ViewVisitaComponent;
