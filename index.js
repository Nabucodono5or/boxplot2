import { select, selectAll } from "d3-selection";
import { scaleLinear, scaleTime } from "d3-scale";
import { csv } from "d3-fetch";
import { max, min, extent } from "d3-array";
import { axisBottom, axisRight } from "d3-axis";

csv(require("./data/Accidental_Drug_Related_Deaths_2012-2018.csv")).then(
  (data) => {
    let novo = formatandoDados(data);
    let resultadoData = contabilizandoDados(novo);
    console.log(novo);
    console.log(resultadoData);
    boxsplot(resultadoData);
  }
);

function quartile1(array) {
  let q1;
  let posicao;

  array.sort();

  posicao = (1 / 4) * (array.length + 1);
  q1 = array[posicao];

  if (posicao % 1 != 0) {
    let valor1 = array[Math.floor(posicao)];
    let valor2 = array[Math.ceil(posicao)];

    q1 = (valor1 + valor2) / 2;
  }

  return q1;
}

function quartile3(array) {
  let q3;
  let posicao;

  array.sort();

  posicao = (3 / 4) * (array.length + 1);

  if (posicao % 1 != 0) {
    let valor1 = array[Math.floor(posicao)];
    let valor2 = array[Math.ceil(posicao)];

    q3 = (valor1 + valor2) / 2;
  } else {
    q3 = array[posicao];
  }

  return q3;
}

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
    element["q1"] = quartile1(element.idades);
    element["q3"] = quartile3(element.idades);
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

function boxsplot(incomingData) {
  let maxYear = max(incomingData, (d) => {
    return d.ano;
  });
  let minYear = min(incomingData, (d) => {
    return d.ano;
  });

  let timeYear = scaleTime()
    .domain([new Date(minYear - 1, 0, 1), new Date(maxYear, 0, 1)])
    .range([20, 470]);

  let yScale = scaleLinear().domain([0, 100]).range([470, 0]);

  let xAxis = axisBottom(timeYear).ticks(10);
  let yAxis = axisRight(yScale);

  select("svg")
    .append("g")
    .attr("class", "yAxis")
    .attr("transform", "translate(20, 0)")
    .style("opacity", 0.4)
    .call(yAxis);

  select("svg")
    .append("g")
    .attr("class", "xAxis")
    .attr("tranform", "translate(10, 470)")
    .style("opacity", 0.4)
    .call(xAxis);

  select("svg")
    .selectAll("g.box")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "box")
    .attr("transform", function (d) {
      return (
        "translate(" +
        timeYear(new Date(d.ano, 0, 1)) +
        ", " +
        yScale(d.mediana) +
        ")"
      );
    })
    .each(function (d) {
      select(this)
        .append("line")
        .attr("class", "range")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", yScale(d.max) - yScale(d.mediana))
        .attr("y2", yScale(d.min) - yScale(d.mediana))
        .style("stroke", "black")
        .style("stroke-width", "1px");

      select(this)
        .append("line")
        .attr("class", "max")
        .attr("x1", -10)
        .attr("x2", 10)
        .attr("y1", yScale(d.max) - yScale(d.mediana))
        .attr("y2", yScale(d.max) - yScale(d.mediana))
        .style("stroke", "black")
        .style("stroke-width", "1px");

      select(this)
        .append("line")
        .attr("class", "min")
        .attr("x1", -10)
        .attr("x2", 10)
        .attr("y1", yScale(d.min) - yScale(d.mediana))
        .attr("y2", yScale(d.min) - yScale(d.mediana))
        .style("stroke", "black")
        .style("stroke-width", "1px");
    });
}
