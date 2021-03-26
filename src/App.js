import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FooterComponent from "./componentes/FooterComponent/FooterComponent";
import Menu from "./componentes/Menu/Menu";
import CreateApartamentoComponent from "./componentes/Create/CreateApartamentoComponent/CreateApartamentoComponent";
import CreateMoradorComponent from "./componentes/Create/CreateMoradorComponent/CreateMoradorComponent";
import CreateVeiculoComponent from "./componentes/Create/CreateVeiculoComponent/CreateVeiculoComponent";
import CreateVisitanteComponent from "./componentes/Create/CreateVisitanteComponent/CreateVisitanteComponent";
import CreateVisitaComponent from "./componentes/Create/CreateVisitaComponent/CreateVisitaComponent";
import ListApartamentoComponent from "./componentes/List/ListApartamentoComponent/ListApartamentoComponent";
import ListMoradorComponent from "./componentes/List/ListMoradorComponent/ListMoradorComponent";
import ListVeiculoComponent from "./componentes/List/ListVeiculoComponent/ListVeiculoComponent";
import ListVisitanteComponent from "./componentes/List/ListVisitanteComponent/ListVisitanteComponent";
import ListVisitaComponent from "./componentes/List/ListVisitaComponent/ListVisitaComponent";
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
          <div className="menu">
            <Menu />
          </div>
          <div className="conteudo">
            <Switch>
              <Route path="/" exact component={ListApartamentoComponent} />

              {/* Apartamentos */}
              <Route path="/apartamentos" component={ListApartamentoComponent} />
              <Route path="/gerenciar-apartamento/:id" component={CreateApartamentoComponent} />
              <Route path="/ver-apartamento/:id" component={ViewApartamentoComponent} />
              
              {/* Moradores */}
              <Route path="/moradores" component={ListMoradorComponent} />
              <Route path="/gerenciar-morador/:id" component={CreateMoradorComponent} />
              <Route path="/ver-morador/:id" component={ViewMoradorComponent} />

              {/* Veículos */}
              <Route path="/veiculos" component={ListVeiculoComponent} />
              <Route path="/gerenciar-veiculo/:id" component={CreateVeiculoComponent} />
              <Route path="/ver-veiculo/:id" component={ViewVeiculoComponent} />

              {/* Visitantes */}
              <Route path="/visitantes" component={ListVisitanteComponent} />
              <Route path="/gerenciar-visitante/:id" component={CreateVisitanteComponent} />
              <Route path="/ver-visitante/:id" component={ViewVisitanteComponent} />

              {/* Visitas */}
              <Route path="/visitas" component={ListVisitaComponent} />
              <Route path="/gerenciar-visita/:id" component={CreateVisitaComponent} />
              <Route path="/ver-visita/:id" component={ViewVisitaComponent} />
            </Switch>
          </div>
        </div>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;
