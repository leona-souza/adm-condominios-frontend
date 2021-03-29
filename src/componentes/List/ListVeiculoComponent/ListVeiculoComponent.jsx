import React, { PureComponent } from "react";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VeiculoService from "../../../services/VeiculoService";
import ApartamentoService from "../../../services/ApartamentoService";

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
  }

  componentDidMount() {
    let mapaAptos = new Map();
    let listaDeVeiculos = [];

    VeiculoService.getVeiculos()
    .then(res => listaDeVeiculos = res.data)
    .then(() => {
      listaDeVeiculos.forEach(
        morador => mapaAptos.set(morador.apartamentoVeiculo, "")
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
      listaDeVeiculos.forEach(
        morador => morador.apartamentoVeiculo = mapaAptos.get(morador.apartamentoVeiculo)
      )
    })
    .then(() => {
      this.setState({ veiculos: listaDeVeiculos });
    });
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
                <td>{veiculo.marca} {veiculo.modelo}</td>
                <td>{veiculo.cor}</td>
                <td>{veiculo.placa}</td>
                <td> {veiculo.apartamentoVeiculo}</td>
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
      </div>
    );
  }
}

export default ListVeiculoComponent;
