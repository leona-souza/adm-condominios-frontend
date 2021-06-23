import React, { useState, useEffect, useRef } from "react";
import { apartamentoModelForm } from "../../../models/Apartamento";
import { moradorModelForm } from "../../../models/Morador";
import { veiculoModelForm } from "../../../models/Veiculo";
import { visitanteModelForm } from "../../../models/Visitante";
import { visitaModelForm } from "../../../models/Visita";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import "./CreateObjects.css";

function CreateObject(props) {
  let modeloDeObjeto;
  const { id } = props.match.params;
  const [objeto, setObjeto] = useState({});
  const timerRef = useRef(null);
  const { type } = props;

  switch(type) {
    case "apartamento":
      modeloDeObjeto = apartamentoModelForm;
      break;
    case "morador":
      modeloDeObjeto = moradorModelForm;
      break;
    case "veiculo":
      modeloDeObjeto = veiculoModelForm;
      break;
    case "visitante":
      modeloDeObjeto = visitanteModelForm;
      break;
    case "visita":
      modeloDeObjeto = visitaModelForm;
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

  const buscarNomes = async (nome) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const nomesConsultados = await objeto.consultarNomes(nome);
      setObjeto(prevState => ({ ...prevState, nomesConsultados }));
    }, 1000)
  }

  const changeHandler = async (e) => { 
    const { campos } = objeto;
    const temp = campos.find(key => key.name === e.target.name);
    temp.value = e.target.value;
    setObjeto({ ...objeto, campos });

    if (e.target.name === "nomeVisitante") {  
      const valor = e.target.value.length > 0 ? e.target.value : null;
      await buscarNomes(valor);
    } 
  };

  const cancel = () => {
    window.location.href = objeto.enderecoVoltar;
  };

  const changeVisitanteHandler = (id, nome) => {
    const { campos } = objeto;
    const novoNome = campos.find(key => key.name === "nomeVisitante");
    novoNome.value = nome;

    setObjeto({ 
      ...objeto,
      visitante: id,
      nomesConsultados: [],
      campos
    });
  }

  const exibirNomes = (nomes) => {
    let retorno = [];
      if (nomes.length < 1) {
        return;
      }
      nomes.map(item => retorno.push(
        <li 
          className="input__li"
          key={item.id} 
          onClick={() => { changeVisitanteHandler(item.id, item.nome) }}>
            {item.nome}
        </li>
      ));

      return (
        <div className="input__sugestoes">
          <ul className="input__ul">{retorno}</ul>
        </div>
      );
  }

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
                        type={campo.type}
                        placeholder={campo.placeholder}
                        name={campo.name}
                        className={campo.cssInput}
                        value={campo.value}
                        onChange={changeHandler}
                      />
                      {
                        (type === "visita" && campo.name === "nomeVisitante") 
                          && 
                        exibirNomes(objeto.nomesConsultados)
                      }
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
