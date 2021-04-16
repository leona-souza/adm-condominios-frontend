import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ApartamentoService from "../../../services/ApartamentoService";
import Paginator from "../../Paginator/Paginator";
import "./ListApartamentoComponent.css";
import { LIMITE } from "../../../resources/Config";
import Functions from "../../../resources/Functions";

class ListApartamentoComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      apartamentos: [],
      paginas: {
        pagina: 1,
        limite: LIMITE,
      }
    };
    this.addApartamento = this.addApartamento.bind(this);
    this.putApartamento = this.putApartamento.bind(this);
    this.deleteApartamento = this.deleteApartamento.bind(this);
    this.viewApartamento = this.viewApartamento.bind(this);
  }

  componentDidMount() {
    this.coletarDados(this.state.paginas.pagina);
  }

  coletarDados = (paginaAtual) => {
    ApartamentoService.getApartamentosPaginados(paginaAtual, LIMITE)
    .then(res => {
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, this);
      this.setState({
        apartamentos: res.data.resultados
      });
    })
  }

  addApartamento = () => {
    this.props.history.push("/gerenciar-apartamento/novo");
  };

  putApartamento = (id) => {
    this.props.history.push(`/gerenciar-apartamento/${id}`);
  };

  deleteApartamento = (id) => {
    let apto = this.state.apartamentos.filter(
      apartamento => apartamento.id === id
    );
    if (
      window.confirm(
        `Deseja realmente excluir o apartamento ${apto[0].numero}-${apto[0].torre}?`
      )
    ) {
      ApartamentoService.deleteApartamento(id).then(() => {
        this.setState({
          apartamentos: this.state.apartamentos.filter(
            apartamento => apartamento.id !== id
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
                <td data-title="Apartamento">{apartamento.numero}</td>
                <td data-title="Torre">{apartamento.torre}</td>
                <td data-title="Vaga">{apartamento.vaga}&nbsp;</td>
                <td>
                  <span className="tabela__acoes">
                    <DescriptionIcon className="tabela__icone" onClick={() => this.viewApartamento(apartamento.id)} />
                    <EditIcon className="tabela__icone" onClick={() => this.putApartamento(apartamento.id)} />
                    <DeleteIcon className="tabela__icone red" onClick={() => this.deleteApartamento(apartamento.id)} />
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
          onUpdate={this.coletarDados}
        />
      </div>
    );
  }
}

export default ListApartamentoComponent;
