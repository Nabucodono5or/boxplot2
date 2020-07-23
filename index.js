import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";
import { max, min } from "d3-array";

csv(require("./data/Accidental_Drug_Related_Deaths_2012-2018.csv")).then(
  (data) => {
    let novo = formatandoDados(data);
    console.log(formatandoDados(data));
    console.log(contabilizandoDados(novo));
  }
);

function contabilizandoDados(novo) {
  novo.forEach((element) => {
    let maiorIdade = max(element.idades, (d) => {
      return d;
    });
    let menorIdade = min(element.idades, (d) => {
      return d;
    });
    let mediaIdades = Math.round(element["somaIdades"] / element["number"]);
    let mediana = (maiorIdade + menorIdade) / 2;

    element["min"] = menorIdade;
    element["max"] = maiorIdade;
    element["media"] = mediaIdades;
    element["mediana"] = Math.round(mediana);
  });

  return novo;
}

function formatandoDados(data) {
  let novo = [];
  data.forEach((element) => {
    let year = new Date(element.Date);
    let encontrado = buscarDadoFormatado(novo, year);
    let idade = element.Age;

    if (!encontrado) {
      let obj = criarOjetoFormatado(year, idade);
      novo.push(obj);
    } else {
      encontrado["number"] += 1;
      encontrado["somaIdades"] += parseInt(idade);
      encontrado["idades"].push(parseInt(idade));
    }
  });

  return novo;
}

function criarOjetoFormatado(year, idade) {
  let obj = {};
  let age = parseInt(idade);
  obj["ano"] = year.getFullYear();
  obj["number"] = 1;
  obj["somaIdades"] = age;
  obj["idades"] = [];
  obj["idades"].push(age);
  return obj;
}

function buscarDadoFormatado(arrayFormatado, year) {
  let encontrado = arrayFormatado.find((d) => {
    return d["ano"] == year.getFullYear();
  });

  return encontrado;
}
