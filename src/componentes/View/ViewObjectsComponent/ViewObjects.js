import React, { useState, useEffect } from "react";
import { apartamentoModelDetalhes } from "../../../models/Apartamento";
import { moradorModelDetalhes } from "../../../models/Morador";
import { veiculoModelDetalhes } from "../../../models/Veiculo";
import ApartmentIcon from '@material-ui/icons/Apartment';
import PersonIcon from '@material-ui/icons/Person';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import "./ViewObjects.css";

function ViewObjectsComponent(props) {
  let modeloDeObjeto;
  let icone = null;
  const [objeto, setObjeto] = useState({});

  switch(props.type) {
    case "apartamento":
      modeloDeObjeto = apartamentoModelDetalhes;
      icone = <ApartmentIcon fontSize="inherit" />
      break;
    case "morador":
      modeloDeObjeto = moradorModelDetalhes;
      icone = <PersonIcon fontSize="inherit" />
      break;
    case "veiculo":
      modeloDeObjeto = veiculoModelDetalhes;
      icone = <DriveEtaIcon fontSize="inherit" />
      break;
    default:
  }

  useEffect(() => {
    modeloDeObjeto.coletarDados(props.match.params.id)
      .then(res => setObjeto(res))
  }, []);

  return (
    <div className="largura">
      <div className="titulo">{objeto.titulo}</div>
      <div className="caixa">
        <div className="caixa__titulo">
          <div className="titulo__icone">{icone}</div>
          <div className="fonte__apartamento">{objeto.apartamento && `${objeto.apartamento?.numero}-${objeto.apartamento?.torre}`}</div>
          <div className="detalhes__botoes botao__cursor" onClick={() => objeto.put(objeto.apartamento.id)}><EditIcon />Alterar</div>
        </div>
        <div className="caixa__detalhes">
          <div className="detalhes__linha">
            <div className="detalhes__titulo">Vaga:</div>
            <div className="detalhes__texto">{objeto.apartamento?.vaga}</div>
          </div>
          <div className="detalhes__linha">
            <div className="detalhes__titulo">Moradores:</div>
            <div className="detalhes__texto">{objeto.moradores}</div>
          </div>
          <div className="detalhes__linha">
            <div className="detalhes__titulo">Veículos:</div>
            <div className="detalhes__texto">{objeto.veiculos}</div>
          </div>
          <div className="detalhes__linha">
            <div className="detalhes__titulo">Visitantes:</div>
            <div className="detalhes__texto">{objeto.visitantes}</div>
          </div>
          <div className="detalhes__linha">
            <div className="detalhes__titulo">Obs:</div>
            <div className="detalhes__texto">{objeto.apartamento?.obs}</div>
          </div>
        </div>
      </div>
      <div className="detalhes__botoes botao__cursor" onClick={objeto.listarTodos}>
        <ArrowBackIosIcon /> Voltar
      </div>
    </div>
  );
}

export default ViewObjectsComponent;
