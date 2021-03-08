import React, { PureComponent } from "react";
import VisitanteService from "../../services/VisitanteService";
import ApartamentoService from "../../services/ApartamentoService";
import "./CreateVisitanteComponent.css";

class CreateVisitanteComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      nome: "",
      documento: "",
      telefone: "",
      apartamento: "",
      lista: [],
    };

    this.changeNomeHandler = this.changeNomeHandler.bind(this);
    this.changeDocumentoHandler = this.changeDocumentoHandler.bind(this);
    this.changeTelefoneHandler = this.changeTelefoneHandler.bind(this);
    this.changeApartamentoHandler = this.changeApartamentoHandler.bind(this);
    this.manageVisitante = this.manageVisitante.bind(this);
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
          VisitanteService.getVisitanteById(this.state.id)
            .then((res) => {
              this.setState({
                nome: res.data.nome,
                documento: res.data.documento || "",
                telefone: res.data.telefone || "",
                apartamento: res.data.apartamentoVisitante
              });
            });
        }
      });

  }

  changeNomeHandler = (event) => {
    this.setState({ nome: event.target.value });
  };

  changeDocumentoHandler = (event) => {
    this.setState({ documento: event.target.value });
  };

  changeTelefoneHandler = (event) => {
    this.setState({ telefone: event.target.value });
  };

  changeApartamentoHandler = (event) => {
    this.setState({ apartamento: event.target.value });
  };

  manageVisitante = (e) => {
    e.preventDefault();
    let visitante = {
      nome: this.state.nome,
      documento: this.state.documento,
      telefone: this.state.telefone,
      apartamentoVisitante: this.state.apartamento,
    };
    if (this.state.id === "novo") {
      VisitanteService.createVisitante(visitante).then((res) => {
        this.props.history.push("/visitantes");
      });
      this.setState({ nome: "" });
      this.setState({ documento: "" });
      this.setState({ telefone: "" });
      this.setState({ apartamento: "" });
    } else {
      VisitanteService.updateVisitante(visitante, this.state.id).then((res) => {
        this.props.history.push("/visitantes");
      });
    }
  };

  cancel = () => {
    this.props.history.push("/visitantes");
  };

  titulo = () => {
    return this.state.id === "novo" ? "Novo Visitante" : "Alterar Visitante";
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
                    <label>Nome</label>
                    <input
                      placeholder="Nome"
                      name="nome"
                      className="form-control"
                      value={this.state.nome}
                      onChange={this.changeNomeHandler}
                    />
                    <label>Documento</label>
                    <input
                      placeholder="Documento"
                      name="documento"
                      className="form-control"
                      value={this.state.documento}
                      onChange={this.changeDocumentoHandler}
                    />
                    <label>Telefone</label>
                    <input
                      placeholder="Telefone"
                      name="telefone"
                      className="form-control"
                      value={this.state.telefone}
                      onChange={this.changeTelefoneHandler}
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
                    <div className="createVisitante__botoes">
                      <button
                        className="btn btn-success"
                        onClick={this.manageVisitante}
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

export default CreateVisitanteComponent;
