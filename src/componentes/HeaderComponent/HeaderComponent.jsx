import React, { PureComponent } from "react";

class HeaderComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <header>
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div>
              <a href="/" className="navbar-brand">
                Apartamentos
              </a>
              <a href="/moradores" className="navbar-brand">
                Moradores
              </a>
              <a href="/veiculos" className="navbar-brand">
                Veiculos
              </a>
              <a href="/visitantes" className="navbar-brand">
                Visitantes
              </a>
              <a href="/visitas" className="navbar-brand">
                Visitas
              </a>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

export default HeaderComponent;
