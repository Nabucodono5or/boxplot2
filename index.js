import { select, selectAll } from "d3-selection";
import { csv } from "d3-fetch";

csv(require("./data/Accidental_Drug_Related_Deaths_2012-2018.csv")).then(
  (data) => {
    console.log(data);
  }
);
