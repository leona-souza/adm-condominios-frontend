import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ApartamentoService from "../../../services/ApartamentoService";
import Paginator from "../../Paginator/Paginator";
import "./ListObjects.css";
import { LIMITE } from "../../../resources/Config";
import Apartamento from "../../../models/Apartamento";
import Morador from "../../../models/Morador";
import Veiculo from "../../../models/Veiculo";

class ListObjects extends PureComponent {
  constructor(props) {
    super(props);
    
    switch (this.props.type) {
      case "apartamentos":
        this.state = { objeto: new Apartamento() };
        break;
      case "moradores":
        this.state = { objeto: new Morador() };
        break;
      case "veiculos":
        this.state = { objeto: new Veiculo() };
        break;
      default:
    }

    this.state = {
      ...this.state,
      objects: [],
      paginas: {
        pagina: 1,
        limite: LIMITE,
      }
    };

    this.addObject = this.addObject.bind(this);
    this.putObject = this.putObject.bind(this);
    this.deleteObject = this.deleteObject.bind(this);
    this.viewObject = this.viewObject.bind(this);
  }

  componentDidMount() {
    this.state.objeto.coletarDados(this.state.paginas.pagina, this);
  }

  percorrerCampos = (obj) => {
    let temp = [];
    for (const [key, valor] of Object.entries(obj)) {
      if (key !== "id") {
        temp.push(<td key={valor} data-title="Torre">{valor}</td>);
      }
    }
    return temp;    
  }

  addObject = () => {
    this.state.objeto.add();
  };

  putObject = (id) => {
    this.state.objeto.put(id);
  };

  viewObject = (id) => {
    this.state.objeto.view(id);
  };

  deleteObject = (id) => {
    let objeto = this.state.objects.filter(
      obj => obj.id === id
    );
    if (
      window.confirm(
        this.state.objeto.mensagemDeletar(objeto[0])
      )
    ) {
      this.state.objeto.deleteObject(id)
      .then(() => {
        this.setState({
          objects: this.state.objects.filter(
            obj => obj.id !== id
          ),
        });
      });
    }
  };

  render() {
    return (
      <div className="largura">
        <div className="titulo">{this.state.objeto.titulo}</div>
        <div className="botao__cursor botao__novo" onClick={this.addObject}><AddCircleOutlineIcon /> {this.state.objeto.adicionar}</div>
        <table className="tabela">
          <thead>
            <tr>
              {this.state.objeto.colunasDeListagem.map(coluna => 
                <th key={coluna} className="tabela__titulo">{coluna}</th>
              )}
              <th className="tabela__titulo">Ações</th>
            </tr>
          </thead>
          <tbody>
            {this.state.objects.map(obj => (
              <tr key={obj.id}>
                {this.percorrerCampos(obj)}
                <td>
                  <span className="tabela__acoes">
                    <DescriptionIcon className="tabela__icone" onClick={() => this.viewObject(obj.id)} />
                    <EditIcon className="tabela__icone" onClick={() => this.putObject(obj.id)} />
                    <DeleteIcon className="tabela__icone red" onClick={() => this.deleteObject(obj.id)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Paginator 
          pagina={this.state.paginas.pagina} 
          total={this.state.paginas.total}
          limite={this.state.paginas.limite}
          onUpdate={this.state.objeto.coletarDados}
        />
      </div>
    );
  }
}

export default ListObjects;
