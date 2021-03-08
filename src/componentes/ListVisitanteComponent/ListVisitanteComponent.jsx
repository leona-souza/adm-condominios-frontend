import React, { PureComponent } from "react";
import VisitanteService from "../../services/VisitanteService";
import ApartamentoService from "../../services/ApartamentoService";

class ListVisitanteComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visitantes: [],
      info: [],
    };
    this.addVisitante = this.addVisitante.bind(this);
    this.putVisitante = this.putVisitante.bind(this);
    this.deleteVisitante = this.deleteVisitante.bind(this);
    this.viewVisitante = this.viewVisitante.bind(this);
    this.findApartamento = this.findApartamento.bind(this);
  }

  componentDidMount() {
    let temp = [];

    VisitanteService.getVisitantes()
      .then((res) => {
        res.data.map(async dado => {
          await this.findApartamento(dado.apartamentoVisitante);
          let apto = this.state.info.numero;
          let torre = this.state.info.torre;
          let aptoId = this.state.info.aptoId;

          temp = { ...dado, apto, torre, aptoId };
          this.setState({
            visitantes: [...this.state.visitantes, ...[temp]],
          });
        });
      });
  }

  async findApartamento(apartamentoId) {
    await ApartamentoService.getApartamentoById(apartamentoId).then(
      (resposta) =>
        this.setState({
          info: {
            aptoId: resposta.data.apartamentoVisitante,
            numero: resposta.data.numero,
            torre: resposta.data.torre,
          },
        })
    );
  }

  addVisitante = () => {
    this.props.history.push("/gerenciar-visitante/novo");
  };

  putVisitante = (id, aptoId) => {
    this.props.history.push(`/gerenciar-visitante/${id}`);
  };

  deleteVisitante = (id) => {
    let visitante = this.state.visitantes.filter((item) => item.id === id);
    if (
      window.confirm(
        `Deseja realmente excluir o visitante ${visitante[0].nome}?`
      )
    ) {
      VisitanteService.deleteVisitante(id).then((res) => {
        this.setState({
          visitantes: this.state.visitantes.filter(
            (visitante) => visitante.id !== id
          ),
        });
      });
    }
  };

  viewVisitante = (id) => {
    this.props.history.push(`/ver-visitante/${id}`);
  };

  render() {
    return (
      <div>
        <h2 className="text-center">Lista de Visitantes</h2>
        <div>
          <table className="table-striped table-bordered tabela">
            <thead>
              <tr>
                <th className="listvisitante__botaonovovisitante" colSpan="3">
                  <button
                    className="btn btn-primary"
                    onClick={this.addVisitante}
                  >
                    Novo Visitante
                  </button>
                </th>
              </tr>
              <tr>
                <th className="apartamento_largura">Nome</th>
                <th className="torre_largura">Apartamento</th>
                <th className="acoes_largura">Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.visitantes
                .sort((a, b) => {
                  if (a.nome < b.nome) {
                    return -1;
                  }
                  if (a.nome > b.nome) {
                    return 1;
                  }
                  return 0;
                })
                .map((visitante) => (
                  <tr key={visitante.id}>
                    <td className="apartamento_largura">{visitante.nome}</td>
                    <td className="torre_largura">
                      {visitante.apto} - {visitante.torre}
                    </td>
                    <td className="acoes_largura">
                      <button
                        className="btn btn-info"
                        onClick={() => this.viewVisitante(visitante.id)}
                      >
                        Ver Detalhes
                      </button>
                      <div className="divisor" />
                      <button
                        className="btn btn-info"
                        onClick={() =>
                          this.putVisitante(visitante.id, visitante.aptoId)
                        }
                      >
                        Alterar
                      </button>
                      <div className="divisor" />
                      <button
                        className="btn btn-danger"
                        onClick={() => this.deleteVisitante(visitante.id)}
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

export default ListVisitanteComponent;
