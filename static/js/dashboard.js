var apiKey = "Z1SWFKTG08NRZOO7";
ticker='GOOG'
var url = 
`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${apiKey}`


function buildPlot() {
    d3.json(url).then(function(data) {
      console.log(data);
    function unpack(rows, index) {
      return rows.map(function(row) {
        if (row[index] == "None")
          return 0;
        else 
        return row[index];
      });
    }
    // Returns: YYYY-MM-DD
    // Grab values from the data json object to build the plots
    var name = data['symbol'];
    var quartReports=data["quarterlyReports"];
    var width=60, height=70;
    console.log(name);
    document.getElementById("headertag").innerHTML = name;
    //Generate the header info for the chart
    startDate =new Date()
    endDate= new Date(startDate.getFullYear(),startDate.getMonth(), startDate.getDate()-365)
    display_year = endDate.getFullYear() + "-"+ startDate.getFullYear();
    header=[name, display_year]
    //Filter the Quarterly data for the past year
    var yearsData = quartReports.filter(x => {
        var date = new Date(x["fiscalDateEnding"])
        return (date >= endDate && date <= startDate)
    })
    console.log(yearsData)
    var totalRevenue = unpack(yearsData, "totalRevenue"); 
    var operatingIncome = unpack(yearsData, "operatingIncome"); 
    var netIncome = unpack(yearsData, "netIncome"); 
    var COGS= unpack(yearsData, "costofGoodsAndServicesSold");
    var dates = unpack(yearsData, "fiscalDateEnding");
    var depreciation = unpack(yearsData, "depreciation");
    var operatingExpenses = unpack(yearsData, "operatingExpenses");
     
    //GPF is (Revenue - COGS)/Revenue 
    var grossProfitMargin = totalRevenue.map(function(i, j) {return (i-COGS[j])/i});
    const gpmAvg= grossProfitMargin.reduce((a,b) => a + b, 0)*100/grossProfitMargin.length
    var grossProfit = totalRevenue.map(function(i, j) {return (i-COGS[j])});
    const gpAvg= grossProfit.reduce((a,b) => a + b, 0)/grossProfit.length
    // console.log(gpmAvg)
    // console.log(grossProfit)
    // console.log(gpAvg)
    console.log("here")
    console.log(operatingExpenses)
    console.log(depreciation)
    //operatingExpenses = OpEX - depreceation/total REvenue
    // var OPEX_margin  = operatingExpenses.map(function(i, j) { return (i-depreciation[j]/totalRevenue[j])})
    var OPEX_margin_net  = operatingExpenses.map(function(i, j) { return (i-depreciation[j])})
    var OPEX_margin = OPEX_margin_net.map(function(i, j) { return (i/totalRevenue[j])})
    const opexAvg= OPEX_margin.reduce((a,b) => a + b, 0)*100/OPEX_margin.length
    console.log(opexAvg)
    // Display charts
    header=[name, display_year, "Revenue"]
    drawChart(header, totalRevenue, dates, 'plot1') 
    header=[name, display_year, "Operating Income"]
    drawChart(header, operatingIncome, dates, 'plot2')
    header=[name, display_year, "Net Income"]
    drawChart(header, netIncome, dates, 'plot3');
    drawDonutChart("#donut1", gpmAvg, width, height, ".2em");
    drawDonutChart("#donut2", opexAvg, width, height, ".2em");
    })
}
  function drawChart(headerArr, revenueArr, dateArr, id) {
    //Trace the chart
    var trace1 = {
      type: "bar",
      mode: "lines",
      name: "high",
      x: dateArr,
      y: revenueArr,
      sparkline: {
          enabled: true
      },
      marker: {
        color: 'rgba(50,171,96,0.6)',
        line: {
          color: 'rgba(50,171,96,1.0)',
          width: 1
        }
      }    
    };

    var layout = {
      grid: {rows: 1, columns: 2, pattern: 'independent'},
      showlegend: false,
      autosize: true,
      width: 350,
      height: 240,
      xaxis: {
        type: "date",
        tickfont: {
            family: 'Old Standard TT, serif',
            size: 10,
            color: 'black'
          },
      },
      yaxis: {
        autorange: true,
        type: "linear",
        tickfont: {
            family: 'Old Standard TT, serif',
            size: 10,
            color: 'black'
          },
      }
      
    };
    layout.title = { 
        text: `${headerArr[2]}`, 
        font: {
          size: 14,
        },
        x: 0.3,
        y: 2.2,
        xanchor: 'center',
        yanchor: 'top',
      };
  
    var data = [trace1];
    const config = {
        'displayModeBar': false // this is the line that hides the bar.
    };
    //   Plotly.newPlot("plot", data, layout); 
    Plotly.newPlot(id, data, layout, config );
 }

  
  function drawDonutChart(element, percent, width, height, text_y) {
    var duration   = 700,
        transition = 200;
    width = typeof width !== 'undefined' ? width : 60;
    height = typeof height !== 'undefined' ? height : 70;
    text_y = typeof text_y !== 'undefined' ? text_y : ".2em";
  
    var dataset = {
          lower: calcPercent(0),
          upper: calcPercent(percent)
        },
        radius = Math.min(width, height) / 2,
  //       pie = d3.layout.pie().sort(null),
        pie = d3.pie().sort(null),
        format = d3.format(".0%");
    console.log(pie)
    var arc = d3.arc()
          .innerRadius(radius - 9)
          .outerRadius(radius);
   
    var svg = d3.select(element).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
    var path = svg.selectAll("path")
          .data(pie(dataset.lower))
          .enter().append("path")
          .attr("class", function(d, i) { return "color" + i })
          .attr("d", arc)
          .each(function(d) { this._current = d; }); // store the initial values
   console.log(path)
  
    var text = svg.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", text_y);
  
    if (typeof(percent) === "string") {
      text.text(percent);
    }
    else {
      var progress = 0;
      var timeout = setTimeout(function () {
        clearTimeout(timeout);
        path = path.data(pie(dataset.upper)); // update the data
        path.transition().duration(duration).attrTween("d", function (a) {
          // Store the displayed angles in _current.
          // Then, interpolate from _current to the new angles.
          // During the transition, _current is updated in-place by d3.interpolate.
          var i  = d3.interpolate(this._current, a);
          var i2 = d3.interpolate(progress, percent)
          this._current = i(0);
          return function(t) {
            text.text( format(i2(t) / 100) );
            return arc(i(t));
          };
        }); // redraw the arcs
      }, 200);
    };
  
  function calcPercent(percent) {
    return [percent, 100-percent];
  };
 }
buildPlot();
