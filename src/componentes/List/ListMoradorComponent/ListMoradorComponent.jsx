import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoradorService from "../../../services/MoradorService";
import ApartamentoService from "../../../services/ApartamentoService";

class ListMoradorComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      moradores: [],
      paginas: {
        pagina: 1,
        limite: 5
      }
    };
    this.addMorador = this.addMorador.bind(this);
    this.putMorador = this.putMorador.bind(this);
    this.deleteMorador = this.deleteMorador.bind(this);
    this.viewMorador = this.viewMorador.bind(this);
  }

  componentDidMount() {
    let mapaAptos = new Map();
    let listaDeMoradores = [];
    const paginaAtual = this.state.paginas.pagina;
    const paginaLimite = this.state.paginas.limite;

    MoradorService.getMoradoresPaginados(paginaAtual, paginaLimite)
    .then(res => listaDeMoradores = res.data.resultados)
    .then(() => {
      listaDeMoradores.forEach(
        morador => mapaAptos.set(morador.apartamentoMorador, "")
      )
    })
    .then(async () => {
      const arrayDeAptos = Array.from(mapaAptos.keys());
      await ApartamentoService.getApartamentosByList(arrayDeAptos)
      .then(resAptos => {
        resAptos.data.forEach(apto => mapaAptos.set(apto.id, apto.numero+"-"+apto.torre))
      })
    })
    .then(() => {
      listaDeMoradores.forEach(
        morador => morador.apartamentoMorador = mapaAptos.get(morador.apartamentoMorador)
      )
    })
    .then(() => {
      this.setState({ moradores: listaDeMoradores });
    });
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
      <div className="largura">
        <div className="titulo">Lista de Moradores</div>
        <div className="botao__cursor botao__novo" onClick={this.addMorador}><AddCircleOutlineIcon /> Adicionar morador</div>
          <table className="tabela">
            <thead>
              <tr>
                <th className="tabela__titulo">Nome</th>
                <th className="tabela__titulo">Apartamento</th>
                <th className="tabela__titulo">Ações</th>
              </tr>
            </thead>
            <tbody>
              {this.state.moradores
                .sort((a, b) => (a.nome > b.nome) ? 1 : -1)
                .map((morador) => (
                  <tr key={morador.id}>
                    <td data-title="Nome">{morador.nome}</td>
                    <td data-title="Apartamento">{morador.apartamentoMorador}</td>
                    <td>
                      <span className="tabela__acoes">
                        <DescriptionIcon className="tabela__icone" onClick={() => this.viewMorador(morador.id)} />
                        <EditIcon className="tabela__icone" onClick={() => this.putMorador(morador.id, morador.aptoId)} />
                        <DeleteIcon className="tabela__icone red" onClick={() => this.deleteMorador(morador.id)} />
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
      </div>
    );
  }
}

export default ListMoradorComponent;
