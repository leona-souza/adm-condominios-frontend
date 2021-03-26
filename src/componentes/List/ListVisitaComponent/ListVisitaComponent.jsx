import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisitaService from "../../../services/VisitaService";
import ApartamentoService from "../../../services/ApartamentoService";
import VisitanteService from "../../../services/VisitanteService";
import Functions from "../../../resources/Functions";

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
      mapa.set(dado.apartamento, "");
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
      mapa.set(dado.visitante, "");
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
      <div className="largura">
        <div className="titulo">Registro de Visitas</div>
        <div className="botao__cursor botao__novo" onClick={this.addVisita}><AddCircleOutlineIcon /> Registrar visita</div>
        <table className="tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Apartamento</th>
              <th>Visitante</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {this.state.visitas.map(visita => (
              <tr key={visita.id}>
                <td>{visita.data}</td>
                <td>{visita.apartamento}</td>
                <td>{visita.visitante}</td>
                <td>
                  <DescriptionIcon className="tabela__icone" onClick={() => this.viewVisita(visita.id)} />
                  <EditIcon className="tabela__icone" onClick={() => this.putVisita(visita.id, visita.aptoId)} />
                  <DeleteIcon className="tabela__icone red" onClick={() => this.deleteVisita(visita.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ListVisitaComponent;
