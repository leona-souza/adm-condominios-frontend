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
    let mapaAptos = new Map();
    let mapaNomes = new Map();
    let listaDeVisitas = [];

    VisitaService.getVisitas()
    .then(res => {
      listaDeVisitas = res.data;
    })
    .then(async () => {
      await this.mapearApartamentos(mapaAptos, listaDeVisitas);
    })
    .then(async () => {
      await this.mapearVisitantes(mapaNomes, listaDeVisitas);
    })
    .then(() => {
      this.converterDados(listaDeVisitas, mapaAptos, mapaNomes);
    })
    .then(() => {
      this.setState({ visitas: listaDeVisitas });
    });  
  }

  mapearApartamentos = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.apartamento, "indefinido");
    });
    const arrayApartamentos = Array.from(mapa.keys());
    await ApartamentoService.getApartamentosByList(arrayApartamentos)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
    });
  }

  mapearVisitantes = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.visitante, "indefinido");
    });
    const arrayVisitantes = Array.from(mapa.keys());
    await VisitanteService.getVisitantesByList(arrayVisitantes)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.nome);
        });    
    });
  }

  converterDados = (array, mapaAptos, mapaNomes) => {
    for (const key in array) {
      const nome = mapaNomes.get(array[key].visitante);
      const apto = mapaAptos.get(array[key].apartamento);
      array[key].visitante = nome;
      array[key].apartamento = apto;
      array[key].data = Functions.dataFromDbToScreen(array[key].data);
    };
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
