import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FooterComponent from "./componentes/FooterComponent/FooterComponent";
import HeaderComponent from "./componentes/HeaderComponent/HeaderComponent";
import CreateApartamentoComponent from "./componentes/CreateApartamentoComponent/CreateApartamentoComponent";
import CreateMoradorComponent from "./componentes/CreateMoradorComponent/CreateMoradorComponent";
import CreateVeiculoComponent from "./componentes/CreateVeiculoComponent/CreateVeiculoComponent";
import CreateVisitanteComponent from "./componentes/CreateVisitanteComponent/CreateVisitanteComponent";
import ListApartamentoComponent from "./componentes/ListApartamentoComponent/ListApartamentoComponent";
import ListMoradorComponent from "./componentes/ListMoradorComponent/ListMoradorComponent";
import ListVeiculoComponent from "./componentes/ListVeiculoComponent/ListVeiculoComponent";
import ListVisitanteComponent from "./componentes/ListVisitanteComponent/ListVisitanteComponent";
import ListVisitaComponent from "./componentes/ListVisitaComponent/ListVisitaComponent";
import ViewApartamentoComponent from "./componentes/ViewApartamentoComponent/ViewApartamentoComponent";
import ViewMoradorComponent from "./componentes/ViewMoradorComponent/ViewMoradorComponent";
import ViewVeiculoComponent from "./componentes/ViewVeiculoComponent/ViewVeiculoComponent";
import ViewVisitanteComponent from "./componentes/ViewVisitanteComponent/ViewVisitanteComponent";

function App() {
  return (
    <div>
      <Router>
        <HeaderComponent />
        <div className="container">
          <Switch>
            teste
            <Route path="/" exact component={ListApartamentoComponent} />
            <Route path="/apartamentos" component={ListApartamentoComponent} />
            <Route
              path="/gerenciar-apartamento/:id"
              component={CreateApartamentoComponent}
            />
            <Route
              path="/ver-apartamento/:id"
              component={ViewApartamentoComponent}
            />
            <Route path="/moradores" component={ListMoradorComponent} />
            <Route
              path="/gerenciar-morador/:id"
              component={CreateMoradorComponent}
            />
            <Route path="/ver-morador/:id" component={ViewMoradorComponent} />
            <Route path="/veiculos" component={ListVeiculoComponent} />
            <Route
              path="/gerenciar-veiculo/:id"
              component={CreateVeiculoComponent}
            />
            <Route path="/ver-veiculo/:id" component={ViewVeiculoComponent} />
            <Route path="/visitantes" component={ListVisitanteComponent} />
            <Route
              path="/gerenciar-visitante/:id"
              component={CreateVisitanteComponent}
            />
            <Route
              path="/ver-visitante/:id"
              component={ViewVisitanteComponent}
            />
            <Route path="/visitas" component={ListVisitaComponent} />
           {/* <Route
              path="/gerenciar-visita/:id"
              component={CreateVisitaComponent}
            />
            <Route
              path="/ver-visita/:id"
              component={ViewVisitaComponent}
           /> */}
          </Switch>
        </div>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;
