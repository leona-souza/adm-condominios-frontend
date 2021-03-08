import React, { PureComponent } from "react";
import VeiculoService from "../../services/VeiculoService";
import ApartamentoService from "../../services/ApartamentoService";

class ListVeiculoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      veiculos: [],
      info: [],
    };
    this.addVeiculo = this.addVeiculo.bind(this);
    this.putVeiculo = this.putVeiculo.bind(this);
    this.deleteVeiculo = this.deleteVeiculo.bind(this);
    this.viewVeiculo = this.viewVeiculo.bind(this);
    this.findApartamento = this.findApartamento.bind(this);
  }

  componentDidMount() {
    let temp = [];

    VeiculoService.getVeiculos()
      .then(res => {
        res.data.map(async dados => {
          await this.findApartamento(dados.apartamentoVeiculo);
          let apto = this.state.info.numero;
          let torre = this.state.info.torre;
          let aptoId = this.state.info.aptoId;
          temp = { ...dados, apto, torre, aptoId };
          this.setState({
            veiculos: [...this.state.veiculos, ...[temp]],
          });
        })
      });
  }

  async findApartamento(apartamentoId) {
    await ApartamentoService.getApartamentoById(apartamentoId).then(
      (resposta) =>
        this.setState({
          info: {
            aptoId: resposta.data.apartamentoVeiculo,
            numero: resposta.data.numero,
            torre: resposta.data.torre,
          },
        })
    );
  }

  addVeiculo = () => {
    this.props.history.push("/gerenciar-veiculo/novo");
  };

  putVeiculo = (id, aptoId) => {
    this.props.history.push(`/gerenciar-veiculo/${id}`);
  };

  deleteVeiculo = (id) => {
    let veiculo = this.state.veiculos.filter((item) => item.id === id);
    if (
      window.confirm(`Deseja realmente excluir o veículo ${veiculo[0].modelo}?`)
    ) {
      VeiculoService.deleteVeiculo(id).then((res) => {
        this.setState({
          veiculos: this.state.veiculos.filter((veiculo) => veiculo.id !== id),
        });
      });
    }
  };

  viewVeiculo = (id) => {
    this.props.history.push(`/ver-veiculo/${id}`);
  };

  render() {
    return (
      <div>
        <h2 className="text-center">Lista de Veículos</h2>
        <div>
          <table className="table-striped table-bordered tabela">
            <thead>
              <tr>
                <th className="listveiculo__botaonovoveiculo" colSpan="6">
                  <button className="btn btn-primary" onClick={this.addVeiculo}>
                    Novo Veículo
                  </button>
                </th>
              </tr>
              <tr>
                <th className="apartamento_largura">Modelo</th>
                <th className="torre_largura">Marca</th>
                <th className="torre_largura">Cor</th>
                <th className="torre_largura">Placa</th>
                <th className="torre_largura">Apartamento</th>
                <th className="acoes_largura">Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.veiculos.sort((a, b) => {
                  return (a.modelo > b.modelo) ? 1 : -1;
                }).map((veiculo) => (
                <tr key={veiculo.id}>
                  <td className="apartamento_largura">{veiculo.modelo}</td>
                  <td className="apartamento_largura">{veiculo.marca}</td>
                  <td className="apartamento_largura">{veiculo.cor}</td>
                  <td className="apartamento_largura">{veiculo.placa}</td>
                  <td className="torre_largura">
                    {veiculo.apto} - {veiculo.torre}
                  </td>
                  <td className="acoes_largura">
                    <button
                      className="btn btn-info"
                      onClick={() => this.viewVeiculo(veiculo.id)}
                    >
                      Ver Detalhes
                    </button>
                    <div className="divisor" />
                    <button
                      className="btn btn-info"
                      onClick={() =>
                        this.putVeiculo(veiculo.id, veiculo.aptoId)
                      }
                    >
                      Alterar
                    </button>
                    <div className="divisor" />
                    <button
                      className="btn btn-danger"
                      onClick={() => this.deleteVeiculo(veiculo.id)}
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

export default ListVeiculoComponent;
