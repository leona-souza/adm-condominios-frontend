import React, { useState, useEffect, useContext } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginator from "../../Paginator/Paginator";
import { LIMITE } from "../../../resources/Config";
import { apartamentoModelListagem } from "../../../models/Apartamento";
import { moradorModelListagem } from "../../../models/Morador";
import { veiculoModelListagem } from "../../../models/Veiculo";
import retornoVisitante from "../../../models/Visitante";
import retornoVisita from "../../../models/Visita";
import PaginacaoContext from "../../../context/PaginacaoContext";
import "./ListObjects.css";

function ListObjects(props) {
  let modeloDeObjeto = null;
  const [objeto, setObjeto] = useState({});
  const [paginas, setPaginas] = useState({
    pagina: 1,
    limite: LIMITE,
  });

  switch (props.type) {
    case "apartamentos":
      modeloDeObjeto = apartamentoModelListagem;
      break;
    case "moradores":
      modeloDeObjeto = moradorModelListagem;
      break;
    case "veiculos":
      modeloDeObjeto = veiculoModelListagem;
      break;
    case "visitantes":
      modeloDeObjeto = retornoVisitante;
      break;
    case "visitas":
      modeloDeObjeto = retornoVisita;
      break;
    default:
  }    

  useEffect(() => {
    modeloDeObjeto.coletarDados(paginas.pagina)
      .then(res => setObjeto(res))
      .catch(e => console.log('erro', e));
  }, []);

  const percorrerCampos = (obj) => {
    let temp = [];
    for (const [key, valor] of Object.entries(obj)) {
      if (key !== "id") {
        temp.push(<td key={valor} data-title={objeto.equivalencia?.get(key)}>{valor}</td>);
      }
    }
    return temp;    
  }

  const deleteObject = (id) => {
    let objeto = objeto.filter(
      obj => obj.id === id
    );
    if (
      window.confirm(
        objeto.mensagemDeletar(objeto[0])
      )
    ) {
      objeto.deleteObject(id)
      .then(() => {
        this.setState({
          objeto: objeto.filter(
            obj => obj.id !== id
          ),
        });
      });
    }
  };

    return (
      <div className="largura">
        <div className="titulo">{objeto.titulo}</div>
        <div className="botao__cursor botao__novo" onClick={() => objeto.add()}><AddCircleOutlineIcon /> {objeto.adicionar}</div>
        <table className="tabela">
          <thead>
            <tr>
              {objeto.colunasDeListagem?.map(coluna => 
                <th key={coluna} className="tabela__titulo">{coluna}</th>
              )}
              <th className="tabela__titulo">Ações</th>
            </tr>
          </thead>
          <tbody>
            {objeto.valores?.map(obj => (
              <tr key={obj.id}>
                {percorrerCampos(obj)}
                <td>
                  <span className="tabela__acoes">
                    <DescriptionIcon className="tabela__icone" onClick={() => objeto.view(obj.id)} />
                    <EditIcon className="tabela__icone" onClick={() => objeto.put(obj.id)} />
                    <DeleteIcon className="tabela__icone red" onClick={() => deleteObject(obj.id)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

          <Paginator 
            pagina={paginas.pagina} 
            total={paginas.total}
            limite={paginas.limite}
            onUpdate={objeto.coletarDados}
          />

      </div>
    );
  }

export default ListObjects;
