import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisitanteService from "../../../services/VisitanteService";
import ApartamentoService from "../../../services/ApartamentoService";

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
      <div className="largura">
        <div className="titulo">Lista de Visitantes</div>
        <div className="botao__cursor botao__novo" onClick={this.addVisitante}><AddCircleOutlineIcon /> Adicionar visitante</div>
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Apartamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {this.state.visitantes.sort((a, b) => (a.nome < b.nome) ? -1 : 1)
              .map((visitante) => (
                <tr key={visitante.id}>
                  <td>{visitante.nome}</td>
                  <td>{visitante.apartamentoVisitante}</td>
                  <td>
                    <DescriptionIcon className="tabela__icone" onClick={() => this.viewVisitante(visitante.id)} />
                    <EditIcon className="tabela__icone" onClick={() => this.putVisitante(visitante.id, visitante.aptoId)} />
                    <DeleteIcon className="tabela__icone red" onClick={() => this.deleteVisitante(visitante.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ListVisitanteComponent;
