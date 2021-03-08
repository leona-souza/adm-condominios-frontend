import React, { PureComponent } from "react";
import VisitanteService from "../../services/VisitanteService";
import ApartamentoService from "../../services/ApartamentoService";
import "./ViewVisitanteComponent.css";

class ViewVisitanteComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      visitante: {},
    };
  }

  componentDidMount() {
    /*VisitanteService.getVisitanteById(this.state.id).then((res) => {
      this.setState({ visitante: res.data });
    });*/

    VisitanteService.getVisitanteById(this.state.id).then(async (res) => {
      await ApartamentoService.getApartamentoById(res.data.apartamentoVisitante).then(
        (dados) => {
          this.setState({
            visitante: {
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
    this.props.history.push("/visitantes");
  };

  async findVisitantes(apartamentoId) {
    await ApartamentoService.getApartamentoByVisitante(apartamentoId).then(
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
          <h3>Ver detalhes do visitante</h3>
          <div className="card-body">
            <div className="row">
              <strong>Nome:</strong>
              <div className="divisor" />
              <div>{this.state.visitante.nome}</div>
            </div>
            <div className="row">
              <strong>Telefone:</strong>
              <div className="divisor" />
              <div>{this.state.visitante.telefone}</div>
            </div>
            <div className="row">
              <strong>Documento:</strong>
              <div className="divisor" />
              <div>{this.state.visitante.documento}</div>
            </div>
            <div className="row">
              <strong>Apto:</strong>
              <div className="divisor" />
              <div>
                {this.state.visitante.apto} - {this.state.visitante.torre}
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

export default ViewVisitanteComponent;
