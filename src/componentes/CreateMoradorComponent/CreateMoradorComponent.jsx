import React, { PureComponent } from "react";
import MoradorService from "../../services/MoradorService";
import ApartamentoService from "../../services/ApartamentoService";
import "./CreateMoradorComponent.css";

class CreateMoradorComponent extends PureComponent {
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
    this.manageMorador = this.manageMorador.bind(this);
  }

  componentDidMount() {
    ApartamentoService.getApartamentos().then((resposta) => {
      resposta.data.map((dado) => {
        return this.setState({
          lista: [
            ...this.state.lista,
            { aptoId: dado.id, numero: dado.numero, torre: dado.torre },
          ],
        });
      });
    }).then(() => {
      this.setState({ apartamento: this.state.lista[0].aptoId });
    });

    if (this.state.id === "novo") {
      return;
    } else {
      MoradorService.getMoradorById(this.state.id)
        .then((res) => {
          this.setState({
            nome: res.data.nome,
            documento: res.data.documento || "",
            telefone: res.data.telefone || "",
            apartamento: res.data.apartamentoMorador
          });
        })
        .then(() => {
          ApartamentoService.getApartamentoById(this.state.apartamento).then(res => {
            this.setState({
              apartamento: res.data.id
            })
          });
        });
    }
    
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

  manageMorador = (e) => {
    e.preventDefault();
    let morador = {
      nome: this.state.nome,
      documento: this.state.documento,
      telefone: this.state.telefone,
      apartamentoMorador: this.state.apartamento,
    };
    if (this.state.id === "novo") {
      MoradorService.createMorador(morador).then((res) => {
        this.props.history.push("/moradores");
      });
      this.setState({ nome: "" });
      this.setState({ documento: "" });
      this.setState({ telefone: "" });
      this.setState({ apartamento: "" });
    } else {
      MoradorService.updateMorador(morador, this.state.id).then((res) => {
        this.props.history.push("/moradores");
      });
    }
  };

  cancel = () => {
    this.props.history.push("/moradores");
  };

  titulo = () => {
    return this.state.id === "novo" ? "Novo Morador" : "Alterar Morador";
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
                    <div className="createMorador__botoes">
                      <button
                        className="btn btn-success"
                        onClick={this.manageMorador}
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

export default CreateMoradorComponent;
