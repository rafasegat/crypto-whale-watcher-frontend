import React, { FC, useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { types } from "util";
// import * as d3 from "d3";

const d3 = require("d3");

type Props = {
  id: string;
  data: TypeTransaction[];
};

const formatDate = (timestamp) => {
  return formatDistanceToNow(timestamp * 1000, {
    includeSeconds: true,
    addSuffix: true,
  }).replace("about", "");
};

const Bubble: FC<Props> = ({ id, data }: Props) => {
  const refSVGBubbleGraph = useRef();
  const [svg, setSvg] = useState<any>(null);

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 20, bottom: 100, left: 80 },
    width = 826 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // component did mount, initialize svg
  useEffect(() => {
    // create SVG
    const elSVG = d3
      .select(refSVGBubbleGraph.current)
      .attr("class", `svg-injected svg-injected-${id}`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    elSVG.append("rect").attr("class", "rect-overlay");
    elSVG.append("g").attr("class", "x-axis");
    elSVG.append("g").attr("class", "y-axis");
    elSVG.append("g").attr("class", "scatter");

    // Add a clipPath: everything out of this area won't be drawn.
    elSVG
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    setSvg(elSVG);
  }, []);

  useEffect(() => {
    console.log(svg);
    if (!svg || typeof svg === "undefined") return;

    const dateMin = d3.min(data, (t: TypeTransaction) => t.timestamp);
    const dateMax = d3.max(data, (t: TypeTransaction) => t.timestamp);
    const amountMin = d3.min(data, (t: TypeTransaction) =>
      parseFloat(t.amount)
    );
    const amountMax = d3.max(data, (t: TypeTransaction) =>
      parseFloat(t.amount)
    );

    // Add X axis
    const x = d3.scaleTime().domain([dateMin, dateMax]).range([0, width]);
    const xAxis = svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((timestamp: number) => formatDate(timestamp))
      );
    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([amountMin, amountMax])
      .range([height, 0]);

    const yAxis = svg.select(".y-axis").call(d3.axisLeft(y));

    // Add a scale for bubble size
    const z = d3.scaleLinear().domain([amountMin, amountMax]).range([4, 20]);

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
      const html = `Blockchain: ${transaction.blockchain.toUpperCase()} <br>
                    Symbol: ${transaction.symbol.toUpperCase()} <br>
                    Amount: ${transaction.amount}${transaction.symbol} - ${
        transaction.amount_usd
      }USD <br>
                    From: ${transaction.from_address} ${
        transaction.from_owner_type === "exchange"
          ? transaction.from_owner
          : transaction.from_owner_type
      }<br>
      To: ${transaction.to_address} ${
        transaction.to_owner_type === "exchange"
          ? transaction.to_owner
          : transaction.to_owner_type
      }<br>
                    ${formatDate(transaction.timestamp)}<br>`;
      tooltip
        .style("opacity", 1)
        .style("visibility", "visible")
        .style("z-index", "1")
        .html(html);
    };
    const moveTooltip = function (event, d: TypeTransaction) {
      tooltip
        .style("left", event.x + 50 + "px")
        .style("top", event.y + 50 + "px");
    };
    const hideTooltip = function () {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
        .style("visibility", "hidden")
        .style("z-index", "-1");
    };

    // A function that updates the chart when the
    // user zoom and thus new boundaries are available
    const updateChart = (event: any) => {
      // recover the new scale
      var newX = event.transform.rescaleX(x);
      var newY = event.transform.rescaleY(y);

      // update axes with these new boundaries
      xAxis.call(
        d3
          .axisBottom(newX)
          .tickFormat((timestamp: number) => formatDate(timestamp))
      );
      yAxis.call(d3.axisLeft(newY));

      // update circle position
      svg
        .selectAll("circle")
        .attr("cx", (d: TypeTransaction) => newX(d.timestamp))
        .attr("cy", (d: TypeTransaction) => newY(parseFloat(d.amount)));
    };

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", updateChart);

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg
      .select(".rect-overlay")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);

    const update = () => {
      // Create the scatter variable: where both the circles and the brush take place
      var scatter = svg.select(".scatter").attr("clip-path", "url(#clip)");

      const allBubbles = scatter.selectAll("circle").data(data);
      // Enter new bubbles

      allBubbles
        .enter()
        .append("circle")
        .attr("cx", (d: any) => x(d.timestamp))
        .attr("cy", (d: any) => y(parseFloat(d.amount)))
        .attr("r", (d: any) => z(parseFloat(d.amount)))
        .attr("class", "bubble")
        .style("fill", (d: any) => {
          if (d.type === "exchange_to_exchange") return "#5BC0EB4d";
          if (d.type === "unknown_to_exchange") return "#FDE74C4d";
          if (d.type === "exchange_to_unknown") return "#9BC53D4d";
          if (d.type === "unknown_to_wallet") return "#C3423F4d";
          if (d.type === "unknown_to_unknown") return "#404E4D4d";
        })
        .style("stroke", (d: any) => {
          if (d.type === "exchange_to_exchange") return "#5BC0EB";
          if (d.type === "unknown_to_exchange") return "#FDE74C";
          if (d.type === "exchange_to_unknown") return "#9BC53D";
          if (d.type === "unknown_to_wallet") return "#C3423F";
          if (d.type === "unknown_to_unknown") return "#404E4D";
        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

      allBubbles
        // x axis
        .transition()
        .duration(500)
        .attr("cx", (d: any) => x(d.timestamp))
        // y axis
        // .transition()
        // .duration(500)
        .attr("cy", (d: any) => y(parseFloat(d.amount)))
        // r axis
        .transition()
        .duration(200)
        .attr("r", (d: any) => z(parseFloat(d.amount)))
        .attr("class", "bubble")
        .style("fill", (d: any) => {
          if (d.type === "exchange_to_exchange") return "#5BC0EB4d";
          if (d.type === "unknown_to_exchange") return "#FDE74C4d";
          if (d.type === "exchange_to_unknown") return "#9BC53D4d";
          if (d.type === "unknown_to_wallet") return "#C3423F4d";
          if (d.type === "unknown_to_unknown") return "#404E4D4d";
        })
        .style("stroke", (d: any) => {
          if (d.type === "exchange_to_exchange") return "#5BC0EB";
          if (d.type === "unknown_to_exchange") return "#FDE74C";
          if (d.type === "exchange_to_unknown") return "#9BC53D";
          if (d.type === "unknown_to_wallet") return "#C3423F";
          if (d.type === "unknown_to_unknown") return "#404E4D";
        });

      allBubbles.exit().remove();
    };
    console.log(data);
    update();
  }, [data]);

  // if (!data.length) return <div>Loading bubbles...</div>;

  return (
    <div className="dataviz-bubble-graph">
      <svg ref={refSVGBubbleGraph} />
    </div>
  );
};

export default Bubble;
