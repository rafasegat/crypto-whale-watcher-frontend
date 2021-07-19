import React, { FC, useEffect, useState, useRef } from "react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { types } from "util";
// import * as d3 from "d3";

const d3 = require("d3");

type Props = {
  id: string;
  data: TypeTransaction[];
};

const Bubble: FC<Props> = ({ id, data }: Props) => {
  const refBubbleGraph = useRef();
  const [svg, setSvg] = useState<any>(null);

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  useEffect(() => {
    const elSVG = d3
      .select(refBubbleGraph.current)
      .append("svg")
      .attr("class", `svg-injected svg-injected-${id}`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    setSvg(elSVG);
  }, []);

  useEffect(() => {
    if (!svg || typeof svg === "undefined") return;

    const dateMin = d3.min(data, (t: TypeTransaction) => t.timestamp);
    const dateMax = d3.max(data, (t: TypeTransaction) => t.timestamp);
    const amountMin = d3.min(data, (t: TypeTransaction) => t.amount);
    const amountMax = d3.max(data, (t: TypeTransaction) => t.amount);

    // Add X axis
    const x = d3.scaleLinear().domain([dateMin, dateMax]).range([0, width]);

    const customFormat = (timestamp: number) =>
      `${formatDistanceToNowStrict(new Date(timestamp * 1000))} ago`;

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(customFormat));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([amountMin, amountMax])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // Add a scale for bubble size
    const z = d3.scaleLinear().domain([amountMin, amountMax]).range([4, 40]);

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3
      .select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "bubble-graph-tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white");

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = (event: any, transaction: TypeTransaction) => {
      tooltip.transition().duration(200);
      const html = `Blockchain: ${transaction.blockchain} <br>
                    Symbol: ${transaction.symbol} <br>
                    Amount: ${transaction.amount}${transaction.symbol} - ${
        transaction.amount_usd
      }USD <br>
                    From: ${transaction.from.address} ${
        transaction.from.owner_type === "exchange"
          ? transaction.from.owner
          : transaction.from.owner_type
      }<br>
      To: ${transaction.to.address} ${
        transaction.to.owner_type === "exchange"
          ? transaction.to.owner
          : transaction.to.owner_type
      }<br>
                    ${formatDistanceToNowStrict(
                      new Date(transaction.timestamp * 1000),
                      {}
                    )} ago<br>`;
      tooltip.style("opacity", 1).html(html);
    };
    const moveTooltip = function (event, d: TypeTransaction) {
      tooltip
        .style("left", event.x + 50 + "px")
        .style("top", event.y + 50 + "px");
    };
    const hideTooltip = function () {
      tooltip.transition().duration(200).style("opacity", 0);
    };

    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart(event: any) {
      // recover the new scale
      var newX = event.transform.rescaleX(x);
      var newY = event.transform.rescaleY(y);

      // update axes with these new boundaries
      x.call(d3.axisBottom(newX));
      y.call(d3.axisLeft(newY));

      // update circle position
      svg
        .selectAll("dot")
        .attr("cx", function (d: TypeTransaction) {
          return newX(d.timestamp);
        })
        .attr("cy", function (d: TypeTransaction) {
          return newY(d.amount);
        });
    }

    var zoom = d3.zoom();

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("class", "bubbles")
      .attr("cx", (d: any) => x(d.timestamp))
      .attr("cy", (d: any) => y(d.amount))
      .attr("r", (d: any) => z(d.amount))
      .style("fill", (d: any) => {
        if (d.type === "exchange_to_exchange") return "#5BC0EB";
        if (d.type === "unknown_to_exchange") return "#FDE74C";
        if (d.type === "exchange_to_unknown") return "#9BC53D";
        if (d.type === "unknown_to_wallet") return "#C3423F";
        if (d.type === "unknown_to_unknown") return "#404E4D";
      })
      // -3- Trigger the functions
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)
      .call(
        d3.zoom().on("zoom", function (event) {
          console.log(event);
          svg.attr("transform", event.transform);
        })
      );
  }, [data]);

  // if (!data.length) return <div>Loading bubbles...</div>;

  return (
    <div className="dataviz-bubble-graph">
      <div ref={refBubbleGraph}></div>
    </div>
  );
};

export default Bubble;
