import React, { PureComponent } from "react";
import ApartmentIcon from '@material-ui/icons/Apartment';
import PersonIcon from '@material-ui/icons/Person';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import EventIcon from '@material-ui/icons/Event';
import "./Menu.css";

class Menu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="menu">
        <a href="/" className="menu__item"><ApartmentIcon className="menu__icone" />Apartamentos</a>
        <a href="/moradores" className="menu__item"><PersonIcon className="menu__icone" />Moradores</a>
        <a href="/veiculos" className="menu__item"><DriveEtaIcon className="menu__icone" />Veiculos</a>
        <a href="/visitantes" className="menu__item"><EmojiPeopleIcon className="menu__icone" />Visitantes</a>
        <a href="/visitas" className="menu__item"><EventIcon className="menu__icone" />Visitas</a>
      </div>
    );
  }
}

export default Menu;
