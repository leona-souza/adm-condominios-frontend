import React, { PureComponent } from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import MoradorService from "../../../services/MoradorService";
import ApartamentoService from "../../../services/ApartamentoService";
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
      obs: "",
      lista: [],
    };

    this.changeNomeHandler = this.changeNomeHandler.bind(this);
    this.changeDocumentoHandler = this.changeDocumentoHandler.bind(this);
    this.changeTelefoneHandler = this.changeTelefoneHandler.bind(this);
    this.changeApartamentoHandler = this.changeApartamentoHandler.bind(this);
    this.changeObsHandler = this.changeObsHandler.bind(this);
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
            obs: res.data.obs || "",
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
  changeObsHandler = (event) => {
    this.setState({ obs: event.target.value });
  }

  manageMorador = (e) => {
    e.preventDefault();
    let morador = {
      nome: this.state.nome,
      documento: this.state.documento,
      telefone: this.state.telefone,
      obs: this.state.obs,
      apartamentoMorador: this.state.apartamento,
    };
    if (this.state.id === "novo") {
      MoradorService.createMorador(morador).then((res) => {
        this.props.history.push("/moradores");
      });
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
      <div className="largura">
        <div className="titulo">{this.titulo()}</div>
          <form className="formulario">
            <label className="formulario__label">Nome</label>
              <input
                name="nome"
                className="formulario__input"
                value={this.state.nome}
                onChange={this.changeNomeHandler}
              />
            <label className="formulario__label">Documento</label>
              <input
                name="documento"
                className="formulario__input"
                value={this.state.documento}
                onChange={this.changeDocumentoHandler}
              />
            <label className="formulario__label">Telefone</label>
              <input
                name="telefone"
                className="formulario__input"
                value={this.state.telefone}
                onChange={this.changeTelefoneHandler}
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
              <div onClick={this.manageMorador} className="botao__cursor"><SaveIcon /> Salvar</div>
              <div onClick={this.cancel.bind(this)} className="red botao__cursor"><CancelIcon /> Cancelar</div>
            </div>
          </form>
      </div>
    );
  }
}

export default CreateMoradorComponent;
