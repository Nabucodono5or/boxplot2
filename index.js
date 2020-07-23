import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";
import { max, min } from "d3-array";

csv(require("./data/Accidental_Drug_Related_Deaths_2012-2018.csv")).then(
  (data) => {
    console.log(data);
    console.log(formatandoDados(data));
  }
);

function formatandoDados(data) {
  let novo = [];
  data.forEach((element) => {
    let year = new Date(element.Date);
    let encontrado = buscarDadoFormatado(novo, year);

    if (!encontrado) {
      let obj = criarOjetoFormatado(year);
      novo.push(obj);
    } else {
      encontrado["number"] += 1;
    }
  });

  return novo;
}

function criarOjetoFormatado(year) {
  let obj = {};
  obj["ano"] = year.getFullYear();
  obj["number"] = 1;
  return obj;
}

function buscarDadoFormatado(arrayFormatado, year) {
  let encontrado = arrayFormatado.find((d) => {
    return d["ano"] == year.getFullYear();
  });

  return encontrado;
}
