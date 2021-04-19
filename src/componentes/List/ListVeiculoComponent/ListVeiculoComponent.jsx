import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VeiculoService from "../../../services/VeiculoService";
import ApartamentoService from "../../../services/ApartamentoService";
import Paginator from "../../Paginator/Paginator";
import { LIMITE } from "../../../resources/Config";
import Functions from "../../../resources/Functions";

class ListVeiculoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      veiculos: [],
      paginas: {
        pagina: 1,
        limite: LIMITE
      }
    };
    this.addVeiculo = this.addVeiculo.bind(this);
    this.putVeiculo = this.putVeiculo.bind(this);
    this.deleteVeiculo = this.deleteVeiculo.bind(this);
    this.viewVeiculo = this.viewVeiculo.bind(this);
  }

  componentDidMount() {
    this.coletarDados(this.state.paginas.pagina);
  }

  coletarDados = (paginaAtual) => {
    let mapaAptos = new Map();
    let listaDeVeiculos = [];

    VeiculoService.getVeiculosPaginados(paginaAtual, LIMITE)
    .then(res => {
      if (res.data.resultados.length === 0) {
        throw new Error("Nenhum registro encontrado");
      }
      Functions.configurarPaginacao(paginaAtual, LIMITE, res.data.paginas.total, this);
      listaDeVeiculos = res.data.resultados;
    })
    .then(async () => {
      await this.mapearVeiculos(mapaAptos, listaDeVeiculos);
    })
    .then(() => {
      this.converterDados(listaDeVeiculos, mapaAptos);
    })
    .then(() => {
      this.setState({ veiculos: listaDeVeiculos });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  mapearVeiculos = async (mapa, array) => {
    array.forEach(dado => {
      mapa.set(dado.apartamentoVeiculo, "");
    });
    const arrayVeiculos = Array.from(mapa.keys());
    await ApartamentoService.getApartamentosByList(arrayVeiculos)
      .then(res => {
        res.data.forEach(dado => {
          mapa.set(dado.id, dado.numero +"-"+ dado.torre);
        });    
    });
  }

  converterDados = (lista, mapa) => {
    lista.forEach(
      veiculo => veiculo.apartamentoVeiculo = mapa.get(veiculo.apartamentoVeiculo)
    );
  }

  addVeiculo = () => {
    this.props.history.push("/gerenciar-veiculo/novo");
  };

  putVeiculo = (id) => {
    this.props.history.push(`/gerenciar-veiculo/${id}`);
  };

  deleteVeiculo = (id) => {
    let veiculo = this.state.veiculos.filter(item => item.id === id);
    if (
      window.confirm(`Deseja realmente excluir o veículo ${veiculo[0].modelo}?`)
    ) {
      VeiculoService.deleteVeiculo(id).then(() => {
        this.setState({
          veiculos: this.state.veiculos.filter(veiculo => veiculo.id !== id),
        });
      });
    }
  };

  viewVeiculo = (id) => {
    this.props.history.push(`/ver-veiculo/${id}`);
  };

  render() {
    return (
      <div className="largura">
        <div className="titulo">Lista de Veículos</div>
        <div className="botao__cursor botao__novo" onClick={this.addVeiculo}><AddCircleOutlineIcon /> Adicionar veículo</div>
        <table className="tabela">
          <thead>
            <tr>
              <th>Veículo</th>
              <th>Cor</th>
              <th>Placa</th>
              <th>Apartamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {this.state.veiculos.sort((a, b) => (a.modelo > b.modelo) ? 1 : -1)
              .map((veiculo) => (
              <tr key={veiculo.id}>
                <td data-title="Veículo">{veiculo.marca} {veiculo.modelo}</td>
                <td data-title="Cor">{veiculo.cor}</td>
                <td data-title="Placa">{veiculo.placa}</td>
                <td data-title="Apartamento"> {veiculo.apartamentoVeiculo}</td>
                <td>
                  <span className="tabela__acoes">
                    <DescriptionIcon className="tabela__icone" onClick={() => this.viewVeiculo(veiculo.id)} />
                    <EditIcon className="tabela__icone" onClick={() => this.putVeiculo(veiculo.id, veiculo.aptoId)} />
                    <DeleteIcon className="tabela__icone red" onClick={() => this.deleteVeiculo(veiculo.id)} />
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

export default ListVeiculoComponent;
