import React, { PureComponent } from "react";
import MoradorService from "../../services/MoradorService";
import ApartamentoService from "../../services/ApartamentoService";

class ListMoradorComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      moradores: [],
      info: [],
    };
    this.addMorador = this.addMorador.bind(this);
    this.putMorador = this.putMorador.bind(this);
    this.deleteMorador = this.deleteMorador.bind(this);
    this.viewMorador = this.viewMorador.bind(this);
    this.findApartamento = this.findApartamento.bind(this);
  }

  componentDidMount() {
    let temp = [];

    MoradorService.getMoradores()
      .then(res => {
          res.data.map(async dado => {
            await this.findApartamento(dado.apartamentoMorador);
            let apto = this.state.info.numero;
            let torre = this.state.info.torre;
            let aptoId = this.state.info.aptoId;
            temp = { ...dado, apto, torre, aptoId };
            this.setState({
              moradores: [...this.state.moradores, ...[temp]],
            });
          })
      });
  }

  async findApartamento(apartamentoId) {
    await ApartamentoService.getApartamentoById(apartamentoId).then(
      (resposta) => {
        this.setState({
          info: {
            aptoId: resposta.data.id,
            numero: resposta.data.numero,
            torre: resposta.data.torre,
          },
        })
      }
    );
  }

  addMorador = () => {
    this.props.history.push("/gerenciar-morador/novo");
  };

  putMorador = (id, aptoId) => {
    this.props.history.push(`/gerenciar-morador/${id}`);
  };

  deleteMorador = (id) => {
    let morador = this.state.moradores.filter((item) => item.id === id);
    if (
      window.confirm(`Deseja realmente excluir o morador ${morador[0].nome}?`)
    ) {
      MoradorService.deleteMorador(id).then((res) => {
        this.setState({
          moradores: this.state.moradores.filter(
            (morador) => morador.id !== id
          ),
        });
      });
    }
  };

  viewMorador = (id) => {
    this.props.history.push(`/ver-morador/${id}`);
  };

  render() {
    return (
      <div>
        <h2 className="text-center">Lista de Moradores</h2>
        <div>
          <table className="table-striped table-bordered tabela">
            <thead>
              <tr>
                <th className="listmorador__botaonovomorador" colSpan="3">
                  <button className="btn btn-primary" onClick={this.addMorador}>
                    Novo Morador
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
              {this.state.moradores
                .sort((a, b) => {
                  return (a.nome > b.nome) ? 1 : -1;
                })
                .map((morador) => (
                  <tr key={morador.id}>
                    <td className="apartamento_largura">{morador.nome}</td>
                    <td className="torre_largura">
                      {morador.apto} - {morador.torre}
                    </td>
                    <td className="acoes_largura">
                      <button
                        className="btn btn-info"
                        onClick={() => this.viewMorador(morador.id)}
                      >
                        Ver Detalhes
                      </button>
                      <div className="divisor" />
                      <button
                        className="btn btn-info"
                        onClick={() =>
                          this.putMorador(morador.id, morador.aptoId)
                        }
                      >
                        Alterar
                      </button>
                      <div className="divisor" />
                      <button
                        className="btn btn-danger"
                        onClick={() => this.deleteMorador(morador.id)}
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

export default ListMoradorComponent;
