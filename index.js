import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";
import { max, min } from "d3-array";

csv(require("./data/Accidental_Drug_Related_Deaths_2012-2018.csv")).then(
  (data) => {
    console.log(data);
    console.log(criandoObjetos(data));
  }
);

function criandoObjetos(data) {
  let novo = [];
  data.forEach((element) => {
    let year = new Date(element.Date);
    let encontrado = novo.find((d) => {
      return d["ano"] == year.getFullYear();
    });

    if (!encontrado) {
      let obj = {};
      obj["ano"] = year.getFullYear();
      obj["number"] = 0;
      novo.push(obj);
    } else {
      encontrado["number"] += 1;
    }
  });

  return novo;
}
