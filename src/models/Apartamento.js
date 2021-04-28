import ApartamentoService from "../services/ApartamentoService";

class Apartamento {

  listarApartamentos() {
    ApartamentoService.getApartamentos();
  }

  listarApartamentosPaginados(pagina, limite) {
    ApartamentoService.getApartamentosPaginados(pagina, limite);
  }

}

export default new Apartamento();
