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
      info: [],
    };
    this.addMorador = this.addMorador.bind(this);
    this.putMorador = this.putMorador.bind(this);
    this.deleteMorador = this.deleteMorador.bind(this);
    this.viewMorador = this.viewMorador.bind(this);
    this.findApartamento = this.findApartamento.bind(this);
  }

  componentDidMount() {
    let temp = [];

    MoradorService.getMoradores()
      .then(res => {
          res.data.map(async dado => {
            await this.findApartamento(dado.apartamentoMorador);
            let apto = this.state.info.numero;
            let torre = this.state.info.torre;
            let aptoId = this.state.info.aptoId;
            temp = { ...dado, apto, torre, aptoId };
            this.setState({
              moradores: [...this.state.moradores, ...[temp]],
            });
          })
      });
  }

  async findApartamento(apartamentoId) {
    await ApartamentoService.getApartamentoById(apartamentoId).then(
      (resposta) => {
        this.setState({
          info: {
            aptoId: resposta.data.id,
            numero: resposta.data.numero,
            torre: resposta.data.torre,
          },
        })
      }
    );
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
                    <td>{morador.nome}</td>
                    <td>{morador.apto} - {morador.torre}</td>
                    <td>
                      <DescriptionIcon className="tabela__icone" onClick={() => this.viewMorador(morador.id)} />
                      <EditIcon className="tabela__icone" onClick={() => this.putMorador(morador.id, morador.aptoId)} />
                      <DeleteIcon className="tabela__icone red" onClick={() => this.deleteMorador(morador.id)} />
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
