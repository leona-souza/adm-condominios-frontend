import React from "react";
import "./Paginator.css"

const Paginator = (props) => {
  const clicavel = "paginator__botao botao__clicavel";
  const naoClicavel = "paginator__botao ";
  const atual = props.pagina;
  const total = props.total;    
  let paginas = [];

  for (let i=atual-2; i<=atual+2; i++) {
    if (i > 0 && i<=total) {
      paginas.push(i);
    }
  }

  const renderBotoes = (texto, pagina, limiteOuValor, isNumber) => {
    const selecionado = isNumber ? "botao__selecionado" : "";
    return (
      <div 
        key={texto}
        className={(props.pagina !== limiteOuValor) ? clicavel : naoClicavel + selecionado} 
        onClick={() => {
          (props.pagina !== limiteOuValor) && props.onUpdate(pagina, props.limite)
        }}
      >
        {texto}
      </div>
    );
  }

  return (
    <div className="paginator__container">
        {/* Botões iniciais */}
        {renderBotoes("Início", 1, 1)}
        {renderBotoes("<", atual-1, 1)}

        {/* Botões numéricos */}
        {paginas.map(valor => {
          return (
            renderBotoes(valor, valor, valor, true)
          )}
        )}

        {/* Botões finais */}
        {renderBotoes(">", atual+1, total)}
        {renderBotoes("Fim", total, total)}
    </div>
  );
}

export default Paginator;
