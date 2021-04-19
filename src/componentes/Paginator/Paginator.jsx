import React, { PureComponent } from "react";
import "./Paginator.css"
const clicavel = "paginator__botao botao__clicavel";
const naoClicavel = "paginator__botao ";

class Paginator extends PureComponent {
    renderBotoes = (texto, pagina, condicao, numero) => {
      const selecionado = numero ? "botao__selecionado" : "";

      return (
        <div 
          key={pagina}
          className={(this.props.pagina !== condicao) ? clicavel : naoClicavel + selecionado} 
          onClick={() => {
            (this.props.pagina !== condicao) && this.props.onUpdate(pagina, this.props.limite)
          }}
        >
          {texto}
        </div>
      );
    }

  render() {
    const atual = this.props.pagina;
    const total = this.props.total;    
    let paginas = [];

    for (let i=atual-2; i<=atual+2; i++) {
      if (i > 0 && i<=total) {
        paginas.push(i);
      }
    }

    return (
      <div className="paginator__container">
          {/* Botões iniciais */}
          {this.renderBotoes("Início", 1, 1)}
          {this.renderBotoes("<", atual-1, 1)}

          {/* Botões numéricos */}
          {paginas.map(valor => {
            return (
              this.renderBotoes(valor, valor, valor, true)
            )}
          )}

          {/* Botões finais */}
          {this.renderBotoes(">", atual+1, total)}
          {this.renderBotoes("Fim", total, total)}
      </div>
    );
  }
}

export default Paginator;
