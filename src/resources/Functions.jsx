class Functions {

  dataFromDbToScreen(dataCrua) {
    const dataObj = new Date(dataCrua);
    const ano = dataObj.getFullYear();
    const mes = ("0" + (dataObj.getMonth() + 1)).slice(-2);
    const dia = ("0" + dataObj.getDate()).slice(-2);
    const hora = ("0" + dataObj.getHours()).slice(-2);
    const minutos = ("0" + dataObj.getMinutes()).slice(-2);
    return dia + "/" + mes + "/" + ano + " às " + hora + ":" + minutos + "h";
  }
  
  dataToInput(dataCrua) {
    const dataObj = dataCrua ? new Date(dataCrua) : new Date();
    const ano = dataObj.getFullYear();
    const mes = ("0" + (dataObj.getMonth() + 1)).slice(-2);
    const dia = ("0" + dataObj.getDate()).slice(-2);
    const hora = ("0" + dataObj.getHours()).slice(-2);
    const minutos = ("0" + dataObj.getMinutes()).slice(-2);
    return ano +"-"+ mes +"-"+ dia +"T"+ hora +":"+ minutos;
  }

  configurarPaginacao = (paginaAtual, limite, totalResultados, setPaginas) => {
    const total = Math.ceil(totalResultados / limite);
      /* setPaginas({
        pagina: paginaAtual,
        total
      }) */
  }

       /*mapearObjetos = async (mapa, array) => {
        array.forEach(dado => {
          mapa.set(dado.apartamentoVeiculo, "");
        });
        const arrayVeiculos = Array.from(mapa.keys());
        await ApartamentoService.getApartamentosByList(arrayVeiculos)
          .then(res => {
            res.data.forEach(dado => {
              mapa.set(dado.id, dado.numero +"-"+ dado.torre);
            });    
        });
      }
    
      converterDados = (lista, mapa) => {
        lista.forEach(
          veiculo => veiculo.apartamentoVeiculo = mapa.get(veiculo.apartamentoVeiculo)
        );
      } */

}

export default new Functions();