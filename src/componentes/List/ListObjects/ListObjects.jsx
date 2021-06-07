import React, { useState, useEffect } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Paginator from "../../Paginator/Paginator";
import "./ListObjects.css";
import { LIMITE } from "../../../resources/Config";
import Apartamento from "../../../models/Apartamento";
import Morador from "../../../models/Morador";
import Veiculo from "../../../models/Veiculo";
import Visitante from "../../../models/Visitante";
import Visita from "../../../models/Visita";

function ListObjects(props) {
  const [objeto, setObjeto] = useState({});
  const [objects, setObjects] = useState([]);
  const [paginas, setPaginas] = useState({
    pagina: 1,
    limite: LIMITE,
  });

    switch (props.type) {
      case "apartamentos":
        const apto = new Apartamento();

        console.log(apto);
        setObjeto(new Apartamento());
        break;
       case "moradores":
        setObjeto(new Morador());
        break;
      case "veiculos":
        setObjeto(new Veiculo());
        break;
      case "visitantes":
        setObjeto(new Visitante());
        break;
      case "visitas":
        setObjeto(new Visita());
        break;
      default:
    }

  useEffect(() => {
    objeto.coletarDados(paginas.pagina, this);
  }, []);

  const percorrerCampos = (obj) => {
    let temp = [];
    for (const [key, valor] of Object.entries(obj)) {
      if (key !== "id") {
        temp.push(<td key={valor} data-title={this.state.objeto.equivalencia.get(key)}>{valor}</td>);
      }
    }
    return temp;    
  }

  const addObject = () => {
    objeto.add();
  };

  const putObject = (id) => {
    objeto.put(id);
  };

  const viewObject = (id) => {
    objeto.view(id);
  };

  const deleteObject = (id) => {
    let objeto = objects.filter(
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
          objects: objects.filter(
            obj => obj.id !== id
          ),
        });
      });
    }
  };

    return (
      <div className="largura">
        {console.log(objeto)}
        <div className="titulo">{objeto.titulo}</div>
        <div className="botao__cursor botao__novo" onClick={addObject}><AddCircleOutlineIcon /> {objeto.adicionar}</div>
        <table className="tabela">
          <thead>
            <tr>
              {objeto.colunasDeListagem.map(coluna => 
                <th key={coluna} className="tabela__titulo">{coluna}</th>
              )}
              <th className="tabela__titulo">Ações</th>
            </tr>
          </thead>
          <tbody>
            {objects.map(obj => (
              <tr key={obj.id}>
                {percorrerCampos(obj)}
                <td>
                  <span className="tabela__acoes">
                    <DescriptionIcon className="tabela__icone" onClick={() => viewObject(obj.id)} />
                    <EditIcon className="tabela__icone" onClick={() => putObject(obj.id)} />
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
