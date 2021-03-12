import React, { PureComponent } from "react";
import VisitaService from "../../services/VisitaService";
import VisitanteService from "../../services/VisitanteService";
import ApartamentoService from "../../services/ApartamentoService";
import "./CreateVisitaComponent.css";
import Functions from "../../resources/Functions";

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
            <div>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 margemCard">
                            <h3 className="text-center">{this.titulo()}</h3>
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label>Data</label>
                                        <input className="input__visitante" type="datetime-local"
                                            value={this.state.data}
                                            name="data"
                                            className="form-control"
                                            onChange={this.changeDataHandler} />
                                        <div className="divteste">
                                            <label>Visitante</label>
                                            <input
                                                placeholder="Visitante"
                                                name="visitante"
                                                className="form-control"
                                                value={this.state.nomeVisitante}
                                                onChange={this.changeNomeVisitanteHandler}
                                            />
                                            {this.renderSugestoes()}
                                        </div>
                                        <label>Obs</label>
                                        <input
                                            placeholder="Obs"
                                            name="obs"
                                            className="form-control"
                                            value={this.state.obs}
                                            onChange={this.changeObsHandler}
                                        />
                                        <label>Apartamento</label>
                                        <select
                                            name="apartamento"
                                            className="form-control"
                                            value={this.state.apartamento}
                                            onChange={this.changeApartamentoHandler}
                                        >
                                            {this.state.lista.map((dados) => {
                                                return (
                                                    <option key={dados.aptoId} value={dados.aptoId}>
                                                        {dados.numero}-{dados.torre}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="createVisitante__botoes">
                                            <button
                                                className="btn btn-success"
                                                onClick={this.manageVisita}
                                            >
                                                Salvar
                      </button>
                                            <div className="divisor" />
                                            <button
                                                className="btn btn-danger"
                                                onClick={this.cancel.bind(this)}
                                            >
                                                Cancelar
                      </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateVisitaComponent;
