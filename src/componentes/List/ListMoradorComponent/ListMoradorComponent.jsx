import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoradorService from "../../../services/MoradorService";
import ApartamentoService from "../../../services/ApartamentoService";
import Paginator from "../../Paginator/Paginator";
import { LIMITE } from "../../../resources/Config";
import Functions from "../../../resources/Functions";

class ListMoradorComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      moradores: [],
      paginas: {
        pagina: 1,
        limite: LIMITE
      }
    };
    this.addMorador = this.addMorador.bind(this);
    this.putMorador = this.putMorador.bind(this);
    this.deleteMorador = this.deleteMorador.bind(this);
    this.viewMorador = this.viewMorador.bind(this);
  }

  componentDidMount() {    
    this.coletarDados(this.state.paginas.pagina);
  }

  coletarDados = (paginaAtual) => {
    let mapaAptos = new Map();
    let listaDeMoradores = [];
    
    MoradorService.getMoradoresPaginados(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, this);
      listaDeMoradores = res.data.resultados;
    })
    .then(async () => { 
       await this.mapearMoradores(mapaAptos, listaDeMoradores);
    })
    .then(() => {
      this.converterDados(listaDeMoradores, mapaAptos);
    })
    .then(() => {
      this.setState({ moradores: listaDeMoradores });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  mapearMoradores = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.apartamentoMorador, "");
    });
    const arrayMoradores = Array.from(mapa.keys());
    await ApartamentoService.getApartamentosByList(arrayMoradores)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
    });
  }

  converterDados = (lista, mapa) => {
    lista.forEach(
      morador => morador.apartamentoMorador = mapa.get(morador.apartamentoMorador)
    );
  }

  addMorador = () => {
    this.props.history.push("/gerenciar-morador/novo");
  };

  putMorador = (id) => {
    this.props.history.push(`/gerenciar-morador/${id}`);
  };

  deleteMorador = (id) => {
    let morador = this.state.moradores.filter(item => item.id === id);
    if (
      window.confirm(`Deseja realmente excluir o morador ${morador[0].nome}?`)
    ) {
      MoradorService.deleteMorador(id).then(() => {
        this.setState({
          moradores: this.state.moradores.filter(
            morador => morador.id !== id
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
          <Paginator 
            anterior={this.state.paginas.anterior}
            pagina={this.state.paginas.pagina} 
            proxima={this.state.paginas.proxima}
            limite={this.state.paginas.limite}
            total={this.state.paginas.total}
            onUpdate={this.coletarDados}
          />
      </div>
    );
  }
}

export default ListMoradorComponent;
