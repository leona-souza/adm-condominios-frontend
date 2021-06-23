import React from "react";
/* import { createContext } from "react";

export const PaginacaoContext = createContext();

export const PaginacaoProvider = ({ children }) => {
  return (
    <PaginacaoContext.Provider value="isso é um teste">
      {children}
    </PaginacaoContext.Provider>
  );
  
    
} */


export const valor = "alo teste funsionou";

/* export const paginacao = function() {
  console.log('funcionou a funssaum');
} */

export const PaginacaoContext = React.createContext(
  valor
);