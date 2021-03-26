import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ApartamentoService from "../../../services/ApartamentoService";
import "./ListApartamentoComponent.css";

class ListApartamentoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      apartamentos: []
    };
    this.addApartamento = this.addApartamento.bind(this);
    this.putApartamento = this.putApartamento.bind(this);
    this.deleteApartamento = this.deleteApartamento.bind(this);
    this.viewApartamento = this.viewApartamento.bind(this);
  }

  componentDidMount() {
    ApartamentoService.getApartamentos().then((res) => {
      this.setState({
        apartamentos: res.data
      });
    });
  }

  addApartamento = () => {
    this.props.history.push("/gerenciar-apartamento/novo");
  };

  putApartamento = (id) => {
    this.props.history.push(`/gerenciar-apartamento/${id}`);
  };

  deleteApartamento = (id) => {
    let apto = this.state.apartamentos.filter(
      (apartamento) => apartamento.id === id
    );
    if (
      window.confirm(
        `Deseja realmente excluir o apartamento ${apto[0].numero} - ${apto[0].torre}?`
      )
    ) {
      ApartamentoService.deleteApartamento(id).then((res) => {
        this.setState({
          apartamentos: this.state.apartamentos.filter(
            (apartamento) => apartamento.id !== id
          ),
        });
      });
    }
  };

  viewApartamento = (id) => {
    this.props.history.push(`/ver-apartamento/${id}`);
  };

  render() {
    return (
      <div className="largura">
        <div className="titulo">Lista de Apartamentos</div>
        <div className="botao__cursor botao__novo" onClick={this.addApartamento}><AddCircleOutlineIcon /> Adicionar apartamento</div>
        <table className="tabela">
          <thead>
            <tr>
              <th className="tabela__titulo">Apartamento</th>
              <th className="tabela__titulo">Torre</th>
              <th className="tabela__titulo">Vaga</th>
              <th className="tabela__titulo">Ações</th>
            </tr>
          </thead>
          <tbody>
            {this.state.apartamentos.map((apartamento) => (
              <tr key={apartamento.id}>
                <td>{apartamento.numero}</td>
                <td>{apartamento.torre}</td>
                <td>{apartamento.vaga}</td>
                <td>
                  <DescriptionIcon className="tabela__icone" onClick={() => this.viewApartamento(apartamento.id)} />
                  <EditIcon className="tabela__icone" onClick={() => this.putApartamento(apartamento.id)} />
                  <DeleteIcon className="tabela__icone red" onClick={() => this.deleteApartamento(apartamento.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ListApartamentoComponent;
