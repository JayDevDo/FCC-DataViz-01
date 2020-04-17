/*  http://127.0.0.1/JAVA/FCC/04 - Data Visualisation/index.html */

const json_FCC = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const cors_api_url = 'https://cors-anywhere.herokuapp.com/';

let xhttp = new XMLHttpRequest();
let theData = [];

function onLoad(){
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            theData = JSON.parse(this.responseText);
            // console.log("the data", theData.data.length, theData.data)
            makeChart(theData.data);
        }
    };
    xhttp.open("GET", cors_api_url + json_FCC, true);
    xhttp.send();
    return  "request sent";
}

console.log("doing onLoad", onLoad())
let ttText = "None selected";

function makeChart(dataObject){
// for testing with a limited dataset
const chartData = dataObject; 
// .slice(200)
// console.log("Make chart", chartData.length );
// m = margin, t = top, r =right, b = bottom, l = left
const m = { t: 20,r: 10,b: 75,l: 200 };
const appW      =   document.getElementById('app').offsetWidth;
const appH      =   document.getElementById('app').offsetHeight;
const ttBarH    =   50 ;
const h         =   ( (appH * 0.9) - m.t - m.b - ttBarH );
const chartW    =   ( appW * 0.95 );
const w         =   ( chartW - m.t - m.r );
const barW      =   ( w / chartData.length );
/* 
    Getting/setting the upper and lower boundaries of the data set 
    This will make the scales and plotting positiions more readable    
*/
const fItem = chartData[0]; // first item, also the earliest date.
const yrF = fItem[0].split("-")[0] ; 
const gdpF = fItem[1];  // First gdp (not necessarily the smallest)
const lItem = chartData[chartData.length-1]; // Last item, also the latest date
const yrL = lItem[0].split("-")[0] ;
const gdpL = lItem[1]; // Last gdp (not necessarily the largest)
const gdpS = d3.min(chartData, (d)=>{ return d[1] ;} ); // smallest value
const gdpB = d3.max(chartData, (d)=>{ return d[1] ;} ); // biggest value

console.log(
    "fItem:", fItem, "yrF", yrF, "gdpF",gdpF,
    "\nlItem:",lItem, "yrL",yrL, "gdpL",gdpL,
    "\ngdpS", gdpS, "gdpB", gdpB
)

let yPos = d3.scaleLinear().domain([gdpS,gdpB]).range([(h - m.t), m.t]);
let dtFormat =  d3.timeParse("%Y-%m-%d");
let timeScale = d3.scaleTime().domain([dtFormat(fItem[0]),dtFormat(lItem[0])]).range([m.l,w]);

const ttBar =   d3.select("#svgContainer")
                    .append("div")
                    .attr("id","tooltip")
                                .append("text")
                                    .text( ttText  )
                                    .attr("fill", "red" )
                                    .attr("font-size", "16px")
                                    .attr("text-anchor", "center")
                                    .attr("data-date", lItem[0])
                                    .attr("class", "toolTip")
                ;

const myChart = d3.select("#svgContainer")
                    .append("svg")
                    .attr("id","theChart")
                    .attr("width", chartW ) // adding space to the width for y-axis
                    .attr("height", h + m.t + m.b ) // adding space to the height for x-axis
        ;

myChart.append("g").attr("id","theBars").selectAll("rect")
        .data(chartData).enter()
            .append("rect")
            .attr('x', (d)=> { return timeScale( dtFormat( d[0]) ); } )
            .attr('y', (d)=> { return yPos( d[1] ); } )
            .attr("width",  barW)
            .attr('height', (d)=>{ return ( ( h )-( yPos( d[1] ) ) ); })
            .attr("fill", "navy")
            .attr("class", "bar")
            .attr("data-date",(d)=> { return d[0]; }  )
            .attr("data-gdp", (d)=> { return d[1]; }  )
            .on("mouseover", barHover )
    ;

// Add the X Axis
myChart.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(timeScale)
        .tickFormat(d3.timeFormat("%Y-%m")))
            .selectAll("text")	
                .style("text-anchor", "end")
                .attr("font-size","1.5em")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("class","tick")
                .attr("class","x-tick")
                .attr("transform", "rotate(-90)")
;

// Add the Y Axis
myChart.append("g")
        .attr( "class", "axis y-axis" )
        .attr( "transform", "translate(" + m.l + ", " + m.t + " )" )
        .call( d3.axisLeft(yPos) )
            .selectAll("text")	
                .style("text-anchor", "start")
                .attr("dx", "-3.0em")
                .attr("font-size","1.2em")
                .attr("class","tick")
                .attr("class","y-tick")
;

}

function barHover(d,i,e){
    d3.selectAll(".toolTip").remove();
    d3.select("#tooltip").append("text").text([ "Date: ", d[0], " GDP: $ ", d[1], " (bln)"].join("") )
        .attr("fill", "red" )
        .attr("font-size", "16px")
        .attr("text-anchor", "center")
        .attr("data-date", d[0])
        .attr("class", "toolTip")
    ;

// console.log( "fcc bar:", activeBar );
}


