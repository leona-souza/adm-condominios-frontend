import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Menu from "./componentes/Menu/Menu";
import CreateApartamentoComponent from "./componentes/Create/CreateApartamentoComponent/CreateApartamentoComponent";
import CreateMoradorComponent from "./componentes/Create/CreateMoradorComponent/CreateMoradorComponent";
import CreateVeiculoComponent from "./componentes/Create/CreateVeiculoComponent/CreateVeiculoComponent";
import CreateVisitanteComponent from "./componentes/Create/CreateVisitanteComponent/CreateVisitanteComponent";
import CreateVisitaComponent from "./componentes/Create/CreateVisitaComponent/CreateVisitaComponent";
import ViewObjects from "./componentes/View/ViewObjectsComponent/ViewObjects";
import ListObjects from "./componentes/List/ListObjects/ListObjects";
import ViewApartamentoComponent from "./componentes/View/ViewApartamentoComponent/ViewApartamentoComponent";
import ViewMoradorComponent from "./componentes/View/ViewMoradorComponent/ViewMoradorComponent";
import ViewVeiculoComponent from "./componentes/View/ViewVeiculoComponent/ViewVeiculoComponent";
import ViewVisitanteComponent from "./componentes/View/ViewVisitanteComponent/ViewVisitanteComponent";
import ViewVisitaComponent from "./componentes/View/ViewVisitaComponent/ViewVisitaComponent";

function App() {
  return (
    <div>
      <Router>
        <div className="principal">
          <div className="menu-container">
            <Menu />
          </div>
          <div className="conteudo">
            <Switch>
              <Route path="/" exact render={props => <ListObjects {...props} type="apartamentos" />} />
              
              {/* Listagem */}
              <Route path="/apartamentos" render={props => <ListObjects {...props} type="apartamentos" />} />
              <Route path="/moradores" render={props => <ListObjects {...props} type="moradores" />} />
              <Route path="/veiculos" render={props => <ListObjects {...props} type="veiculos" />} />
              <Route path="/visitantes" render={props => <ListObjects {...props} type="visitantes" />} />
              <Route path="/visitas" render={props => <ListObjects {...props} type="visitas" />} />

              {/* Detalhes */}
              <Route path="/ver-apartamento/:id"  render={props => <ViewObjects {...props} type="apartamento" />} />
              <Route path="/ver-morador/:id"  render={props => <ViewObjects {...props} type="morador" />} />
              <Route path="/ver-veiculo/:id"  render={props => <ViewObjects {...props} type="veiculo" />} />

              {/* Apartamentos */}
              {/* <Route path="/ver-apartamento/:id" component={ViewApartamentoComponent} /> */}
              <Route path="/gerenciar-apartamento/:id" component={CreateApartamentoComponent} />
              
              {/* Moradores */}
              {/* <Route path="/ver-morador/:id" component={ViewMoradorComponent} /> */}
              <Route path="/gerenciar-morador/:id" component={CreateMoradorComponent} />

              {/* Veículos */}
              {/* <Route path="/ver-veiculo/:id" component={ViewVeiculoComponent} /> */}
              <Route path="/gerenciar-veiculo/:id" component={CreateVeiculoComponent} />

              {/* Visitantes */}
              {/* <Route path="/visitantes" component={ListVisitanteComponent} /> */}
              <Route path="/gerenciar-visitante/:id" component={CreateVisitanteComponent} />
              <Route path="/ver-visitante/:id" component={ViewVisitanteComponent} />

              {/* Visitas */}
              {/* <Route path="/visitas" component={ListVisitaComponent} /> */}
              <Route path="/gerenciar-visita/:id" component={CreateVisitaComponent} />
              <Route path="/ver-visita/:id" component={ViewVisitaComponent} />
            </Switch>
          </div>
        </div>
        {/* <FooterComponent /> */}
      </Router>
    </div>
  );
}

export default App;
