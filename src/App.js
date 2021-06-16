import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Menu from "./componentes/Menu/Menu";
import ViewObjects from "./componentes/View/ViewObjects/ViewObjects";
import ListObjects from "./componentes/List/ListObjects/ListObjects";
import CreateObjects from "./componentes/Create/CreateObjects/CreateObjects";

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
              <Route path="/ver-visitante/:id"  render={props => <ViewObjects {...props} type="visitante" />} />
              <Route path="/ver-visita/:id"  render={props => <ViewObjects {...props} type="visita" />} />

              {/* Formulários */}
              <Route path="/gerenciar-apartamento/:id"  render={props => <CreateObjects {...props} type="apartamento" />} />
              <Route path="/gerenciar-morador/:id"  render={props => <CreateObjects {...props} type="morador" />} />
              <Route path="/gerenciar-veiculo/:id"  render={props => <CreateObjects {...props} type="veiculo" />} />
              <Route path="/gerenciar-visitante/:id"  render={props => <CreateObjects {...props} type="visitante" />} />
              <Route path="/gerenciar-visita/:id"  render={props => <CreateObjects {...props} type="visita" />} />
              
            </Switch>
          </div>
        </div>
        {/* <FooterComponent /> */}
      </Router>
    </div>
  );
}

export default App;
