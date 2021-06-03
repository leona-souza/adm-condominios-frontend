import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisitanteService from "../../../services/VisitanteService";
import ApartamentoService from "../../../services/ApartamentoService";
import Paginator from "../../Paginator/Paginator";
import { LIMITE } from "../../../resources/Config";
import Functions from "../../../resources/Functions";

class ListVisitanteComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visitantes: [],
      paginas: {
        pagina: 1,
        limite: LIMITE
      }
    };
    this.addVisitante = this.addVisitante.bind(this);
    this.putVisitante = this.putVisitante.bind(this);
    this.deleteVisitante = this.deleteVisitante.bind(this);
    this.viewVisitante = this.viewVisitante.bind(this);
  }

  componentDidMount() {
    this.coletarDados(this.state.paginas.pagina);   
  }

  coletarDados = (paginaAtual) => {
    let mapaAptos = new Map();
    let listaDeVisitantes = [];

    VisitanteService.getVisitantesPaginados(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, this);
      listaDeVisitantes = res.data.resultados;
    })
    .then(async () => {
      await this.mapearVisitantes(mapaAptos, listaDeVisitantes);
    })
    .then(() => {
      this.converterDados(mapaAptos, listaDeVisitantes);
    })
    .then(() => {
      this.setState({ visitantes: listaDeVisitantes });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  mapearVisitantes = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.apartamentoVisitante, "");
    });
    const arrayVisitantes = Array.from(mapa.keys());
    await ApartamentoService.getApartamentosByList(arrayVisitantes)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
    });
  }

  converterDados = (mapa, array) => {
    array.forEach(dados => {
      dados.apartamentoVisitante = mapa.get(dados.apartamentoVisitante);
    });
  }

  addVisitante = () => {
    this.props.history.push("/gerenciar-visitante/novo");
  };

  putVisitante = (id) => {
    this.props.history.push(`/gerenciar-visitante/${id}`);
  };

  deleteVisitante = (id) => {
    let visitante = this.state.visitantes.filter(item => item.id === id);
    if (
      window.confirm(
        `Deseja realmente excluir o visitante ${visitante[0].nome}?`
      )
    ) {
      VisitanteService.deleteVisitante(id).then(() => {
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
                  <td data-title="Nome">{visitante.nome}</td>
                  <td data-title="Apartamento">{visitante.apartamentoVisitante}</td>
                  <td>
                    <span className="tabela__acoes">
                      <DescriptionIcon className="tabela__icone" onClick={() => this.viewVisitante(visitante.id)} />
                      <EditIcon className="tabela__icone" onClick={() => this.putVisitante(visitante.id, visitante.aptoId)} />
                      <DeleteIcon className="tabela__icone red" onClick={() => this.deleteVisitante(visitante.id)} />
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

export default ListVisitanteComponent;
