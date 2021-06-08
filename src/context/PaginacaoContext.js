import { createContext } from "react";

export const PaginacaoContext = createContext();

export const PaginacaoProvider = ({ children }) => {
  return (
    <PaginacaoContext.Provider value="isso é um teste">
      {children}
    </PaginacaoContext.Provider>
  );
  
    
}