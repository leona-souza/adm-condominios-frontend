import React, { PureComponent } from "react";
import ApartamentoService from "../../services/ApartamentoService";
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
      <div>
        <h2 className="text-center">Lista de Apartamentos</h2>
        <div className="row">
          <button
            className="btn btn-primary listApartamento__botaoNovo"
            onClick={this.addApartamento}
          >
            Novo Apartamento
          </button>
        </div>
        <div>
          <table className="table-striped table-bordered tabela">
            <thead>
              <tr>
                <th className="apartamento_largura">Apartamento</th>
                <th className="torre_largura">Torre</th>
                <th className="vaga_largura">Vaga</th>
                <th className="acoes_largura">Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.apartamentos.map((apartamento) => (
                <tr key={apartamento.id}>
                  <td className="apartamento_largura">{apartamento.numero}</td>
                  <td className="torre_largura">{apartamento.torre}</td>
                  <td className="vaga_largura">{apartamento.vaga}</td>
                  <td className="acoes_largura">
                    <button
                      className="btn btn-info"
                      onClick={() => this.viewApartamento(apartamento.id)}
                    >
                      Ver Detalhes
                    </button>
                    <div className="divisor" />
                    <button
                      className="btn btn-info"
                      onClick={() => this.putApartamento(apartamento.id)}
                    >
                      Alterar
                    </button>
                    <div className="divisor" />
                    <button
                      className="btn btn-danger"
                      onClick={() => this.deleteApartamento(apartamento.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ListApartamentoComponent;
