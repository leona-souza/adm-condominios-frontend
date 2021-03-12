import React, { PureComponent } from "react";
import VisitaService from "../../services/VisitaService";
import ApartamentoService from "../../services/ApartamentoService";
import VisitanteService from "../../services/VisitanteService";
import Functions from "../../resources/Functions";

class ListVisitaComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visitas: [],
      infoApto: [],
      infoVisitante: [],
    };
    this.addVisita = this.addVisita.bind(this);
    this.putVisita = this.putVisita.bind(this);
    this.deleteVisita = this.deleteVisita.bind(this);
    this.viewVisita = this.viewVisita.bind(this);
  }

  componentDidMount() {
    const mapaAptos = new Map();
    const mapaNomes = new Map();

    ApartamentoService.getApartamentos()
      .then(res => {
        for (let key in res.data) {
          mapaAptos.set(res.data[key].id, res.data[key].numero+"-"+res.data[key].torre);
        }
      });
    
    VisitanteService.getVisitantes()
      .then(res => {
        for (let key in res.data) {
          mapaNomes.set(res.data[key].id, res.data[key].nome);
        }
      });

    VisitaService.getVisitas()
      .then(async res => {
        let temp = res.data;
        for (let key in temp) {
          temp[key].apartamento = mapaAptos.get(temp[key].apartamento);
          temp[key].visitante = mapaNomes.get(temp[key].visitante);
          temp[key].data = Functions.dataFromDbToScreen(temp[key].data);
        }
        this.setState({ visitas: temp });
      });
  }

  addVisita = () => {
    this.props.history.push("/gerenciar-visita/novo");
  };

  putVisita = (id) => {
    this.props.history.push(`/gerenciar-visita/${id}`);
  };

  deleteVisita = (id) => {
    let visita = this.state.visitas.filter((item) => item.id === id);
    if (
      window.confirm(`Deseja realmente excluir a visita de ${visita[0].visitante} no dia ${visita[0].data}?`)
    ) {
      VisitaService.deleteVisita(id).then((res) => {
        this.setState({
          visitas: this.state.visitas.filter((visita) => visita.id !== id),
        });
      });
    }
  };

  viewVisita = (id) => {
    this.props.history.push(`/ver-visita/${id}`);
  };

  render() {
    return (
      <div>
        <h2 className="text-center">Lista de Visitas</h2>
        <div>
          <table className="table-striped table-bordered tabela">
            <thead>
              <tr>
                <th className="listveiculo__botaonovoveiculo" colSpan="6">
                  <button className="btn btn-primary" onClick={this.addVisita}>
                    Nova Visita
                  </button>
                </th>
              </tr>
              <tr>
                <th className="apartamento_largura">Data</th>
                <th className="torre_largura">Apartamento</th>
                <th className="torre_largura">Visitante</th>
                <th className="acoes_largura">Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.visitas.map(visita => (
                <tr key={visita.id}>
                  <td className="apartamento_largura">{visita.data}</td>
                  <td className="torre_largura">
                    {visita.apartamento}
                  </td>
                  <td className="apartamento_largura">{visita.visitante}</td>
                  <td className="acoes_largura">
                    <button
                      className="btn btn-info"
                      onClick={() => this.viewVisita(visita.id)}
                    >
                      Ver Detalhes
                    </button>
                    <div className="divisor" />
                    <button
                      className="btn btn-info"
                      onClick={() =>
                        this.putVisita(visita.id, visita.aptoId)
                      }
                    >
                      Alterar
                    </button>
                    <div className="divisor" />
                    <button
                      className="btn btn-danger"
                      onClick={() => this.deleteVisita(visita.id)}
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

export default ListVisitaComponent;
