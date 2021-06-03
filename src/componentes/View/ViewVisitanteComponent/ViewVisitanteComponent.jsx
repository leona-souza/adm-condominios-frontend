import React, { PureComponent } from "react";
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import VisitanteService from "../../../services/VisitanteService";
import ApartamentoService from "../../../services/ApartamentoService";
import "./ViewVisitanteComponent.css";

class ViewVisitanteComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      visitante: {},
    };
  }

  componentDidMount() {
    VisitanteService.getVisitanteById(this.state.id).then(async (res) => {
      await ApartamentoService.getApartamentoById(res.data.apartamentoVisitante).then(
        (dados) => {
          this.setState({
            visitante: {
              ...res.data,
              apto: dados.data.numero,
              torre: dados.data.torre,
            },
          });
        }
      );
    });
  }

  listarTodos = () => {
    this.props.history.push("/visitantes");
  };

  putVisitante = (id, aptoId) => {
    this.props.history.push(`/gerenciar-visitante/${id}`);
  };

  async findVisitantes(apartamentoId) {
    await ApartamentoService.getApartamentoByVisitante(apartamentoId).then(
      (resposta) =>
        this.setState({
          info: {
            numero: resposta.data.numero,
            torre: resposta.data.torre,
          },
        })
    );
  }

  render() {
    return (
      <div className="largura">
          <div className="titulo">Ver detalhes do visitante</div>
          <div className="caixa">
            <div className="caixa__titulo">
              <div className="titulo__icone"><EmojiPeopleIcon fontSize="inherit" /></div>
              <div className="fonte__morador">{this.state.visitante?.nome}</div>
              <div className="detalhes__botoes botao__cursor" onClick={() => this.putVisitante(this.state.visitante.id)}><EditIcon />Alterar</div>
            </div>
            <div className="caixa__detalhes">
              <div className="detalhes__linha">
                <div className="detalhes__titulo">Apartamento:</div>
                <div className="detalhes__texto">{this.state.visitante?.apto}-{this.state.visitante?.torre}</div>
              </div>
              <div className="detalhes__linha">
                <div className="detalhes__titulo">Telefone:</div>
                <div className="detalhes__texto">{this.state.visitante?.telefone}</div>
              </div>
              <div className="detalhes__linha">
                <div className="detalhes__titulo">Documento:</div>
                <div className="detalhes__texto">{this.state.visitante?.documento}</div>
              </div>
              <div className="detalhes__linha">
                <div className="detalhes__titulo">Obs:</div>
                <div className="detalhes__texto">{this.state.visitante?.obs}</div>
              </div>
            </div>
          </div>
          <div className="detalhes__botoes botao__cursor" onClick={this.listarTodos}>
            <ArrowBackIosIcon /> Voltar
          </div>
      </div>
    );
  }
}

export default ViewVisitanteComponent;
