var apiKey = "Z1SWFKTG08NRZOO7";
ticker='IBM'
var url = 
`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${apiKey}`

function buildPlot() {
  d3.json(url).then(function(data) {


    function unpack(rows, index) {
      return rows.map(function(row) {
        return row[index];
      });
    }
    // Returns: YYYY-MM-DD
    // Grab values from the data json object to build the plots
    var name = data["Meta Data"]["2. Symbol"];
    var weeklyTimeSeries = data["Weekly Time Series"];
    var timeSeries = [];
    var dates=[]


    for ( var i in weeklyTimeSeries) {
      if (dates.length < 20) {
        timeSeries.push(weeklyTimeSeries[i]);
        dates.push(i)
      }
  }
    // startDate=dates[0];
    // endDate=dates[dates.length];
    console.log("Name :", name);
    console.log("Weekly time series :", weeklyTimeSeries)
    
    // var high = timeSeries.map(function (a) { return a["2. high"] });
    var closingPrices = unpack(timeSeries, "4. close");
    var lowPrices = unpack(timeSeries, "3. low");
    var highPrices = unpack(timeSeries, "2. high");
    var openingPrices = unpack(timeSeries, "1. open");
    var volume = unpack(timeSeries, "5. volume")
    // var dates = unpack(timeSeries, 0); 
    
    console.log(volume);
    console.log(dates);
 
   
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      decreasing: {line: {color: '#7F7F7F'}, }, 
      increasing: {line: {color: 'blue'}},
      line: {
        color: "#17BECF"
      }
      
      
    };
    var trace2 = {
        type: "candlestick",
        x: dates,
        high: highPrices,
        low: lowPrices,
        open: openingPrices,
        close: closingPrices
        }
        
    var data = [trace1, trace2];
    var layout = {
      title: `${ticker} OHLC Chart`,  
      showlegend: false,
      autosize: true,
      width: 320,
      height: 400,
      dragmode: 'zoom',
      margin: {
        r: 40, 
        t: 30, 
        b: 40, 
        l: 60
      }, 
      // shapes: [
      //   {
      //       type: 'rect',
      //       xref: 'x',
      //       yref: 'paper',
      //       fillcolor: '#d3d3d3',
      //       opacity: 0.2,
      //       line: {
      //           width: 0
      //       }
      //   }
      // ],
      showlegend: false,
      xaxis: {
       autorange: true,
       rangeselector: {
        x: 0.4,
        y: 0.96,
        xanchor: 'left',
        font: {size:8},
        buttons: [{
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1 month'
        },  {
            step: 'all',
            label: 'All dates'
        }]
      }
   },
      yaxis: {
        autorange: true,
        type: "linear"
      }
      
    };
    const config = {
      'displayModeBar': false // this is the line that hides the bar.
      
    };
  Plotly.newPlot('plot5', data, layout, config );
  });
}

buildPlot();
