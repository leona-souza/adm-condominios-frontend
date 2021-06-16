import React, { useState, useEffect } from "react";
import { apartamentoModelForm } from "../../../models/Apartamento";
import { moradorModelForm } from "../../../models/Morador";
import { veiculoModelForm } from "../../../models/Veiculo";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import "./CreateObjects.css";

function CreateObject(props) {
  let modeloDeObjeto;
  const { id } = props.match.params;
  const [objeto, setObjeto] = useState({});

  switch(props.type) {
    case "apartamento":
      modeloDeObjeto = apartamentoModelForm;
      break;
    case "morador":
      modeloDeObjeto = moradorModelForm;
      break;
    case "veiculo":
      modeloDeObjeto = veiculoModelForm;
      break;
    default:
  }

  useEffect(() => {
    modeloDeObjeto.coletarDados(id)
      .then(res => setObjeto(res))
      .catch(e => console.log(e));
  }, []);

  const manageObjeto = () => {
    if (id === "novo") {
      objeto.criarObjeto(objeto);
    } else {
      objeto.alterarObjeto(objeto);
    }
  }

  const changeHandler = e => { 
    const { campos } = objeto;
    const temp = campos.find(key => key.name === e.target.name);
    temp.value = e.target.value;
    setObjeto({ ...objeto, campos });
  };

  const cancel = () => {
    window.location.href = objeto.enderecoVoltar;
  };

  return (
    <div className="largura">
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
                case "select":
                  return(
                    <React.Fragment key={campo.name}>
                      {label}
                      <select
                        name={campo.name}
                        className={campo.cssInput}
                        value={campo.value}
                        onChange={changeHandler}
                      >
                        {
                          objeto.listaDeApartamentos.map(dados => {
                            return (
                              <option key={dados.id} value={dados.id}>
                                {dados.numero}-{dados.torre}
                              </option>
                            );
                          })
                        }
                      </select>
                    </React.Fragment>
                  )
                default:
              }
            })}

            <div className="formulario__botoes">
              <div onClick={manageObjeto} className="botao__cursor"><SaveIcon /> Salvar</div>
              <div onClick={cancel} className="red botao__cursor"><CancelIcon /> Cancelar</div>
            </div>
          </form>
        </div>
    </div>
  );
}

export default CreateObject;
