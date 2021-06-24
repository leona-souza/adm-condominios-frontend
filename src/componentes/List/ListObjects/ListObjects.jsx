import React, { useState, useEffect, useCallback } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginator from "../../Paginator/Paginator";
import { apartamentoModelListagem } from "../../../models/Apartamento";
import { moradorModelListagem } from "../../../models/Morador";
import { veiculoModelListagem } from "../../../models/Veiculo";
import { visitanteModelListagem } from "../../../models/Visitante";
import { visitaModelListagem } from "../../../models/Visita";
import "./ListObjects.css";

function ListObjects(props) {
  let modeloDeObjeto = null;
  const [objeto, setObjeto] = useState({
    paginas: {
      pagina: 1,
      limite: 1,
      total: 1
    }
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
      modeloDeObjeto = visitanteModelListagem;
      break;
    case "visitas":
      modeloDeObjeto = visitaModelListagem;
      break;
    default:
  }    

  const coletarDados = useCallback((pagina) => {
    modeloDeObjeto.coletarDados(pagina)
      .then(res => setObjeto(res))
      .catch(e => console.log('erro', e));
  }, [modeloDeObjeto]);

  useEffect(() => {
    coletarDados(objeto.paginas.pagina);
  }, [coletarDados, objeto.paginas.pagina]);


  const percorrerCampos = (obj) => {
    let temp = [];
    for (const [key, valor] of Object.entries(obj)) {
      if (key !== "id") {
        temp.push(<td key={valor} data-title={objeto.equivalencias?.get(key)}>{valor}</td>);
      }
    }
    return temp;    
  }

  const deleteObject = (id) => {
    const objetoParaExcluir = objeto.valores.filter(obj => obj.id === id);
    const novaLista = objeto.valores.filter(obj => obj.id !== id);

    if (
      window.confirm(
        objeto.mensagemDeletar(objetoParaExcluir[0])
      )
    ) {
      objeto.delete(id)
        .then(() => setObjeto({ ...objeto, valores: novaLista }))
        .catch(e => console.log(e));
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
              <tr key={obj.id} onClick={() => objeto.view(obj.id)}>
                {percorrerCampos(obj)}
                <td className="acoes__borda">
                  <span className="tabela__acoes">
                    {/* <DescriptionIcon className="tabela__icone" onClick={() => objeto.view(obj.id)}/> */}
                    <EditIcon className="tabela__icone" onClick={() => objeto.put(obj.id)} />
                    <DeleteIcon className="tabela__icone red" onClick={() => deleteObject(obj.id)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          <Paginator 
            pagina={objeto.paginas?.pagina} 
            total={objeto.paginas?.total}
            onUpdate={coletarDados}
          />
      </div>
    );
  }

export default ListObjects;
