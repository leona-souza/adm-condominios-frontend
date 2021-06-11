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
          <div className={objeto.avatarCss}>{objeto.valorAvatar}</div>
          <div className="detalhes__botoes botao__cursor" onClick={() => objeto.put(objeto.id)}><EditIcon />Alterar</div>
        </div>
        <div className="caixa__detalhes">
          {objeto.valores && objeto.valores.map(obj => (
            <div key={obj.nome} className="detalhes__linha">
              <div className="detalhes__titulo">{obj.nome}:</div>
              <div className="detalhes__texto">{obj.valor}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="detalhes__botoes botao__cursor" onClick={objeto.listarTodos}>
        <ArrowBackIosIcon /> Voltar
      </div>
    </div>
  );
}

export default ViewObjectsComponent;