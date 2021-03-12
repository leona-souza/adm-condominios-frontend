import React, { PureComponent } from "react";
import VisitaService from "../../services/VisitaService";
import VisitanteService from "../../services/VisitanteService";
import ApartamentoService from "../../services/ApartamentoService";
import Functions from "../../resources/Functions";
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

  render() {
    return (
      <div>
        <div className="card col-md-8 offset-md-2 viewApartamento__card">
          <h3>Ver detalhes da visita</h3>
          <div className="card-body">
            <div className="row">
              <strong>Data:</strong>
              <div className="divisor" />
              <div>{Functions.dataFromDbToScreen(this.state.visita.data)}</div>
            </div>
            <div className="row">
              <strong>Visitante:</strong>
              <div className="divisor" />
              <div>{this.state.visita?.visitante}</div>
            </div>
            <div className="row">
              <strong>Apartamento:</strong>
              <div className="divisor" />
              <div>{this.state.visita?.apto +"-"+ this.state.visita?.torre}</div>
            </div>
            <div className="row">
              <strong>Obs:</strong>
              <div className="divisor" />
              <div>
                {this.state.visita?.obs}
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

export default ViewVisitaComponent;
