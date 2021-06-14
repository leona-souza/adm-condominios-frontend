import React, { useState, useEffect } from "react";
import { apartamentoModelForm } from "../../../models/Apartamento";
import ApartamentoService from "../../../services/ApartamentoService";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import "./CreateObjects.css";

function CreateObject() {
  let modeloDeObjeto = apartamentoModelForm.coletarDados("novo");
  const [objeto, setObjeto] = useState({});

  useEffect(() => {
    setObjeto(modeloDeObjeto);
  }, []);

    /* this.state = {
      id: this.props.match.params.id,
      numero: "",
      torre: "",
      vaga: "",
      obs: ""
    }; */

  /* componentDidMount() {
    if (this.state.id === "novo") {
      return;
    } else {
      ApartamentoService.getApartamentoById(this.state.id).then((res) => {
        this.setState({
          numero: res.data.numero,
          torre: res.data.torre,
          vaga: res.data.vaga || "",
          obs: res.data.obs || ""
        });
      });
    }
  } */

  /* changeNumeroHandler = (event) => {
    this.setState({ numero: event.target.value });
  };

  changeTorreHandler = (event) => {
    this.setState({ torre: event.target.value });
  };

  changeVagaHandler = (event) => {
    this.setState({ vaga: event.target.value });
  };

  changeObsHandler = (event) => {
    this.setState({ obs: event.target.value });
  }; */

  /* manageApartamento = (e) => {
    e.preventDefault();
    let apartamento = {
      numero: this.state.numero,
      torre: this.state.torre,
      vaga: this.state.vaga,
      obs: this.state.obs
    };
    if (this.state.id === "novo") {
      ApartamentoService.createApartamento(apartamento).then((res) => {
        this.props.history.push("/apartamentos");
      });
      this.setState({ 
        numero: "",
        torre: "",
        vaga: "",
        obs: ""
      });
    } else {
      ApartamentoService.updateApartamento(apartamento, this.state.id).then(
        (res) => {
          this.props.history.push("/apartamentos");
        }
      );
    }
  }; */

  const changeHandler = e => { 
    const { campos } = objeto;
    const temp = campos.find(key => key.name === e.target.name);
    temp.value = e.target.value;
    setObjeto({ campos });
  };

  const cancel = () => {
    this.props.history.push("/apartamentos");
  };

  return (
    <div className="largura">{console.log(objeto)}
      <div className="titulo">{objeto.titulo}</div>
        <div>
          <form className="formulario">

            {objeto.campos?.map(campo => {
              const label = <label className={campo.cssTitulo}>{campo.titulo}:</label>;

              switch(campo.tipo) {
                case "input":
                  return (
                    <React.Fragment key={campo.name}>
                      {label}
                      <input
                        placeholder={campo.placeholder}
                        name={campo.name}
                        className={campo.cssInput}
                        value={campo.value}
                        onChange={changeHandler}
                      />
                    </React.Fragment>
                  );
                case "textarea":
                  return(
                    <React.Fragment key={campo.name}>
                      {label}
                      <textarea
                        placeholder={campo.placeholder}
                        name={campo.name}
                        className={campo.cssInput}
                        rows={campo.rows}
                        value={campo.value}
                        onChange={changeHandler}
                      />
                    </React.Fragment>
                  );
                default:
              }
            })}

            <div className="formulario__botoes">
              <div /* onClick={this.manageApartamento} */ className="botao__cursor"><SaveIcon /> Salvar</div>
              <div /* onClick={this.cancel.bind(this)} */ className="red botao__cursor"><CancelIcon /> Cancelar</div>
            </div>
          </form>
        </div>
    </div>
  );
}

export default CreateObject;
