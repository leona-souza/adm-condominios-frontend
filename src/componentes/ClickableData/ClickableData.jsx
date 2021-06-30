import { React } from "react";
import { NavLink } from "react-router-dom";

function ClickableData(props) {
  const { valor, redirect } = props.objeto;

  const handleReturn = (valorCru, redirectCru) => {
    if (typeof valorCru === "string") {
      if (!redirectCru) {
        return (<div className="detalhes__texto">{valorCru}</div>);
      } else {
        return(
          <NavLink 
            to={`/${redirectCru}`}
            className="navLink detalhes__array">
              {valorCru}
          </NavLink>
        );
      }
    } else {
      return (
        valorCru.map((item, chave) => (
          <NavLink 
            key={item.id}
            to={`/${redirect}/${item.id}`}
            className="navLink detalhes__array">
              {item.string}
              {(chave+1 !== valorCru.length) && ","}
            </NavLink>
        ))
      )
    }
  }

  return(
    <>
      {handleReturn(valor, redirect)}
    </>
  );
}

export default ClickableData;