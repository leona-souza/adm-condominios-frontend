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
  }

  componentDidMount() {
    let mapaAptos = new Map();
    let listaDeVisitantes = [];

    VisitanteService.getVisitantes()
    .then(res => listaDeVisitantes = res.data)
    .then(() => {
      listaDeVisitantes.forEach(dados => {
        mapaAptos.set(dados.apartamentoVisitante, "indefinido");
      });
    })
    .then(async () => {
      const arrayApartamentos = Array.from(mapaAptos.keys());
      await ApartamentoService.getApartamentosByList(arrayApartamentos)
        .then(resAptos => {
          resAptos.data.forEach(dados => {
            mapaAptos.set(dados.id, dados.numero + "-" + dados.torre);
          });
        })
    })
    .then(() => {
      listaDeVisitantes.forEach(dados => {
        dados.apartamentoVisitante = mapaAptos.get(dados.apartamentoVisitante);
      });
    })
    .then(() => {
      this.setState({ visitantes: listaDeVisitantes });
    });
    
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
                      {visitante.apartamentoVisitante}
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
