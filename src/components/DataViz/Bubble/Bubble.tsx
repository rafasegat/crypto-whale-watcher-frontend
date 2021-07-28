import React, { FC, useEffect, useState, useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { isMobile } from "react-device-detect";
const d3 = require("d3");

type Props = {
  id: string;
  data: TypeTransaction[];
  widthScreen: number;
  symbolSelected: string;
  typeSelected: string[];
};

const readifyDate = (timestamp) => {
  return format(timestamp * 1000, "p dd MMM yyyy");
};

const formatDate = (timestamp) => {
  return formatDistanceToNow(timestamp * 1000, {
    includeSeconds: true,
    addSuffix: true,
  })
    .replace("about", "")
    .replace(" hours", "h");
};

const symbols = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "k" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "G" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
];

function numberFormatter(num) {
  const numToCheck = Math.abs(num);
  for (let i = symbols.length - 1; i >= 0; i--) {
    if (numToCheck >= symbols[i].value) {
      const newNumber = (num / symbols[i].value).toFixed(0);
      return `${newNumber}${symbols[i].symbol}`;
    }
  }
  return "0";
}

const optionsType = [
  {
    label: "Wallet → Exchange",
    color: "red",
    value: "unknown_to_exchange",
  },
  {
    label: "Exchange → Wallet",
    color: "green",
    value: "exchange_to_unknown",
  },
  {
    label: "Wallet → Wallet",
    color: "purple",
    value: "unknown_to_unknown",
  },
  {
    label: "Exchange → Exchange",
    color: "yellow",
    value: "exchange_to_exchange",
  },
  {
    label: "Wallet → Other",
    color: "pink",
    value: "unknown_to_other",
  },
  {
    label: "Other → Wallet",
    color: "black",
    value: "other_to_unknown",
  },
];

const numberWithCommas = (x) => {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    .replace(".00", "");
};

const bubbleColors = {
  green: "#97CC04",
  yellow: "#FBB13C",
  red: "#B80C09",
  purple: "#BEE3DB",
  black: "#B7245C",
  pink: "#F487B6",
};

const Bubble: FC<Props> = ({
  id,
  data,
  widthScreen,
  symbolSelected,
  typeSelected,
}: Props) => {
  const refSVGBubbleGraph = useRef();
  const [svg, setSvg] = useState<any>(null);

  // component did mount, initialize svg
  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = {
        top: 10,
        right: 20,
        bottom: 100,
        left: isMobile ? 40 : 80,
      },
      width = widthScreen - (isMobile ? 20 : 280) - margin.left - margin.right,
      height = isMobile ? 400 : 685 - margin.top - margin.bottom;

    // create SVG
    const elSVG = d3
      .select(refSVGBubbleGraph.current)
      .attr("class", `svg-injected svg-injected-${id}`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    elSVG.append("rect").attr("class", "rect-overlay");
    elSVG.append("g").attr("class", "x-axis-lines");
    // elSVG.append("text").attr("class", "x-axis-legend");
    elSVG.append("g").attr("class", "y-axis-lines");
    // elSVG.append("text").attr("class", "y-axis-legend");

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
    if (!svg || typeof svg === "undefined") return;

    // set the dimensions and margins of the graph
    const margin = {
        top: 10,
        right: 20,
        bottom: 100,
        left: isMobile ? 40 : 80,
      },
      width = widthScreen - (isMobile ? 20 : 280) - margin.left - margin.right,
      height = isMobile ? 400 : 685 - margin.top - margin.bottom;

    // resize width
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const dateMin = d3.min(data, (t: TypeTransaction) => t.timestamp);
    const dateMax = d3.max(data, (t: TypeTransaction) => t.timestamp);
    const amountMin = d3.min(data, (t: TypeTransaction) =>
      parseFloat(t.amount)
    );
    const amountMax = d3.max(data, (t: TypeTransaction) =>
      parseFloat(t.amount)
    );

    //////////////////
    // Add X axis
    /////////////////
    const x = d3.scaleTime().domain([dateMin, dateMax]).range([0, width]);
    const xAxis = svg
      .select(".x-axis-lines")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((timestamp: number) => formatDate(timestamp))
          .tickSize(-height * 1.3)
        // .ticks(12)
      );
    xAxis
      .selectAll("text")
      // .style("text-anchor", "end")
      .attr("dx", "-4em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");
    xAxis.select(".domain").remove();
    // Add X axis label:
    // svg
    //   .select(".x-axis-legend")
    //   .attr("x", width / 2)
    //   .attr("y", height + margin.top + 30)
    //   .style("fill", "#FFF")
    //   .text("PERIOD");

    //////////////////
    // Y axis
    //////////////////
    const y = d3
      .scaleLinear()
      .domain([amountMin, amountMax])
      .range([height, 0]);
    svg
      .select(".y-axis-lines")
      .call(
        d3
          .axisLeft(y)
          .tickFormat((amount: number) =>
            ["btc", "usd", "eth"].includes(symbolSelected)
              ? `${numberFormatter(amount)} ${symbolSelected.toUpperCase()}`
              : `${numberFormatter(amount)} USD`
          )
          .tickSize(-width * 1.6)
        // .ticks(10)
      )
      .select(".domain")
      .remove();

    svg.selectAll(".tick line").attr("stroke", "#ffffff5c");

    // Add a scale for bubble size
    const z = d3.scaleLinear().domain([amountMin, amountMax]).range([5, 30]);

    const getBubbleColor = (type: string, withOpacity: boolean) => {
      if (type === "unknown_to_exchange")
        return bubbleColors.red + (withOpacity ? "66" : "");
      if (type === "exchange_to_unknown")
        return bubbleColors.green + (withOpacity ? "66" : "");
      if (type === "unknown_to_unknown")
        return bubbleColors.purple + (withOpacity ? "66" : "");
      if (type === "exchange_to_exchange")
        return bubbleColors.yellow + (withOpacity ? "66" : "");
      if (type === "unknown_to_other")
        return bubbleColors.pink + (withOpacity ? "66" : "");
      return bubbleColors.black + (withOpacity ? "66" : "");
    };

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3
      .select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "bubble-graph-tooltip")
      .style("color", "white");

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = (event: any, transaction: TypeTransaction) => {
      tooltip.transition().duration(200);

      const amount = `${numberWithCommas(
        transaction.amount
      )}${transaction.symbol.toUpperCase()}`;
      const amount_usd = `${numberWithCommas(transaction.amount_usd)}USD`;
      const from_owner = `${
        transaction.from_owner_type === "exchange"
          ? transaction.from_owner
          : transaction.from_owner_type
      }`;
      const to_owner = `${
        transaction.to_owner_type === "exchange"
          ? transaction.to_owner
          : transaction.to_owner_type
      }`;
      const type = `<span class="capitalize">${transaction.from_owner_type.replace(
        "unknown",
        "unknown wallet"
      )}${
        transaction.from_owner_type === "exchange" ? ` (${from_owner})` : ""
      }</span> → <span class="capitalize">${transaction.to_owner_type.replace(
        "unknown",
        "unknown wallet"
      )}${
        transaction.to_owner_type === "exchange" ? ` (${to_owner})` : ""
      }</span>`;
      const from_address =
        transaction.from_address === "Multiple Addresses"
          ? transaction.from_address
          : `${transaction.from_address.substring(0, 30)}...`;

      const to_address =
        transaction.to_address === "Multiple Addresses"
          ? transaction.to_address
          : `${transaction.to_address.substring(0, 30)}...`;

      const html = `
      <div class="block mb-1 pb-2 border-b border-white ">${type}</div>
      <div class="mb-2 pb-1 border-b border-white">
        <span class="text-base font-bold">${amount}</span>
        <span class="text-xs font-"> / ${amount_usd}</span>
      </div>
      <div class="mb-2">
        <div class="font-bold text-xs">From:</div>
        <div>
          <span>${from_address}</span>
        </div>
      </div>
      <div class="mb-2">
        <div class="font-bold text-xs">To:</div>
        <div>
          <span>${to_address}</span>
        </div>
      </div>
      <div class="mb-2">
        <div class="font-bold text-xs">Hash:</div>
        <div>
          <span>${transaction.hash.substring(0, 30)}...</span>
        </div>
      </div>
      <div class="text-xs italic text-right">${readifyDate(
        transaction.timestamp
      )} - ${formatDate(transaction.timestamp)} ago</div>`;

      tooltip
        .style("opacity", 1)
        .style("visibility", "visible")
        .style("z-index", "1")
        .html(html);
    };
    const moveTooltip = function (event, d: TypeTransaction) {
      tooltip
        .style("left", event.x - 280 + "px")
        .style("top", event.y + 30 + "px");
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
    // const updateChart = (event: any) => {
    //   // recover the new scale
    //   var newX = event.transform.rescaleX(x);
    //   var newY = event.transform.rescaleY(y);

    //   // update axes with these new boundaries
    //   xAxis.call(
    //     d3
    //       .axisBottom(newX)
    //       .tickFormat((timestamp: number) => formatDate(timestamp))
    //   );
    //   yAxis.call(d3.axisLeft(newY));

    //   // update circle position
    //   svg
    //     .selectAll("circle")
    //     .attr("cx", (d: TypeTransaction) => newX(d.timestamp))
    //     .attr("cy", (d: TypeTransaction) => newY(parseFloat(d.amount)));
    // };

    // // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    // const zoom = d3
    //   .zoom()
    //   .scaleExtent([1, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
    //   .extent([
    //     [0, 0],
    //     [width, height],
    //   ])
    //   .on("zoom", updateChart);

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg
      .select(".rect-overlay")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // .call(zoom);

    const update = () => {
      // Create the scatter variable: where both the circles and the brush take place
      var scatter = svg.select(".scatter"); //.attr("clip-path", "url(#clip)");

      const allBubbles = scatter.selectAll("circle").data(data);

      // Enter new bubbles
      allBubbles
        .enter()
        .append("circle")
        .attr("cx", (d: any) => x(d.timestamp))
        .attr("cy", (d: any) =>
          y(
            parseFloat(
              ["btc", "usd", "eth"].includes(symbolSelected)
                ? d.amount
                : d.amount_usd
            )
          )
        )
        .attr("r", (d: any) => z(parseFloat(d.amount)))
        .attr("class", "bubble")
        .style("fill", (d: TypeTransaction) => getBubbleColor(d.type, false))
        .style("stroke", (d: TypeTransaction) => "#333333") // getBubbleColor(d.type, false))
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("click", moveTooltip)
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
        .style("fill", (d: any) => getBubbleColor(d.type, false))
        .style("stroke", (d: any) => "#333333"); // getBubbleColor(d.type, false));

      allBubbles.exit().remove();
    };
    update();
  }, [data, widthScreen]);

  // if (!data.length) return <div>Loading bubbles...</div>;

  return (
    <div className="dataviz-bubble-graph">
      <ul className="flex text-xs w-full justify-end mb-2">
        {typeSelected.map((item) => {
          const option = optionsType.find((option) => option.value === item);
          return (
            <li className="flex items-center mr-3">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ background: bubbleColors[option.color] }}
              />
              <span>{option.label}</span>
            </li>
          );
        })}
      </ul>
      <svg ref={refSVGBubbleGraph} />
    </div>
  );
};

export default Bubble;
