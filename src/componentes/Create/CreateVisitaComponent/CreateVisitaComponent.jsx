import React, { PureComponent } from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import VisitaService from "../../../services/VisitaService";
import VisitanteService from "../../../services/VisitanteService";
import ApartamentoService from "../../../services/ApartamentoService";
import "./CreateVisitaComponent.css";
import Functions from "../../../resources/Functions";

class CreateVisitaComponent extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            data: "",
            hora: "",
            visitante: "",
            obs: "",
            apartamento: "",
            nomeVisitante: "",
            lista: [],
            nomesConsultados: []
        };

        this.changeDataHandler = this.changeDataHandler.bind(this);
        this.changeVisitanteHandler = this.changeVisitanteHandler.bind(this);
        this.changeNomeVisitanteHandler = this.changeNomeVisitanteHandler.bind(this);
        this.changeObsHandler = this.changeObsHandler.bind(this);
        this.changeApartamentoHandler = this.changeApartamentoHandler.bind(this);
        this.manageVisita = this.manageVisita.bind(this);
    }

    componentDidMount() {
        ApartamentoService.getApartamentos()
            .then((resposta) => {
                resposta.data.map((dado) => {
                    return this.setState({
                        lista: [
                            ...this.state.lista,
                            { aptoId: dado.id, numero: dado.numero, torre: dado.torre },
                        ],
                    });
                });
            })
            .then(() => {
                if (this.state.id === "novo") {
                    const dataFormatada = Functions.dataToInput();
                    this.setState({ data: dataFormatada });
                    this.setState({ apartamento: this.state.lista[0].aptoId });
                    return;
                } else {
                    VisitaService.getVisitaById(this.state.id)
                        .then((res) => {
                            this.setState({
                                data: Functions.dataToInput(res.data.data),
                                visitante: res.data.visitante,
                                obs: res.data.obs || "",
                                apartamento: res.data.apartamento
                            });
                        })
                        .then(() => {
                            VisitanteService.getVisitanteById(this.state.visitante)
                                .then(res => {
                                    this.setState({ nomeVisitante: res.data.nome });
                                });
                        });
                }
            });

    }

    changeDataHandler = (event) => {
        this.setState({ data: event.target.value });
    };

    changeVisitanteHandler = (visitanteId, visitanteNome) => {
        this.setState({
            visitante: visitanteId,
            nomesConsultados: "",
            nomeVisitante: visitanteNome
        });
    };

    changeNomeVisitanteHandler = (event) => {
        const nomeConsultar = event.target.value;
        if (nomeConsultar) {
            VisitanteService.getVisitanteByNome(nomeConsultar)
            .then(res => {
                this.setState({ nomesConsultados: res.data });
            });
        } else {
            this.setState({ nomesConsultados: "" });
        }
        this.setState({ nomeVisitante: nomeConsultar });
    }

    changeObsHandler = (event) => {
        this.setState({ obs: event.target.value });
    };

    changeApartamentoHandler = (event) => {
        this.setState({ apartamento: event.target.value });
    };

    renderSugestoes = () => {
        if (this.state.nomesConsultados.length === 0) {
            return null;
        } else {
            return (
                <ul className="input__ul">
                    {
                        this.state.nomesConsultados.map(item => {
                            return <li 
                                className="input__li"
                                key={item.id} 
                                onClick={() => { this.changeVisitanteHandler(item.id, item.nome) }}>
                                    {item.nome}
                                </li>
                        })
                    }
                </ul>
            );
        }
    }

    manageVisita = (e) => {
        e.preventDefault();
        let visita = {
            data: this.state.data,
            visitante: this.state.visitante,
            obs: this.state.obs,
            apartamento: this.state.apartamento,
        };
        if (this.state.id === "novo") {
            if (this.state.visitante) {
                VisitaService.createVisita(visita).then((res) => {
                    this.props.history.push("/visitas");
                });
                this.setState({ data: "" });
                this.setState({ visitante: "" });
                this.setState({ obs: "" });
                this.setState({ apartamento: "" });
            }
        } else {
            VisitaService.updateVisita(visita, this.state.id).then(() => {
                this.props.history.push("/visitas");
            });
        }
    };

    cancel = () => {
        this.props.history.push("/visitas");
    };

    titulo = () => {
        return this.state.id === "novo" ? "Nova Visita" : "Alterar Visita";
    };

    render() {
        return (
            <div class="largura">
                <div className="titulo">{this.titulo()}</div>
                <div>
                    <form className="formulario">
                    <label className="formulario__label">Data</label>
                        <input
                            name="data"
                            type="datetime-local"
                            className="formulario__input"
                            value={this.state.data}
                            onChange={this.changeDataHandler}
                        />
                    <label className="formulario__label">Visitante</label>
                        <input
                            placeholder="Procurar nomes"
                            name="visitante"
                            className="formulario__input"
                            value={this.state.nomeVisitante}
                            onChange={this.changeNomeVisitanteHandler}
                        />
                        {this.renderSugestoes()}
                    <label className="formulario__label">Apartamento</label>
                        <select
                            name="apartamento"
                            className="formulario__input"
                            value={this.state.apartamento}
                            onChange={this.changeApartamentoHandler}
                        >
                        {this.state.lista.map(dados => {
                            return (
                                <option key={dados.aptoId} value={dados.aptoId}>
                                    {dados.numero}-{dados.torre}
                                </option>
                            );
                        })}
                        </select>
                    <label className="formulario__label">Obs:</label>
                        <textarea
                            name="obs"
                            className="formulario__textarea"
                            rows="5"
                            value={this.state.obs}
                            onChange={this.changeObsHandler}
                        />
                    <div className="formulario__botoes">
                        <div onClick={this.manageVisita} className="botao__cursor"><SaveIcon /> Salvar</div>
                        <div onClick={this.cancel.bind(this)} className="red botao__cursor"><CancelIcon /> Cancelar</div>
                    </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default CreateVisitaComponent;
