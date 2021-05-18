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
      if (dates.length < 51) {
        timeSeries.push(weeklyTimeSeries[i]);
        dates.push(i)
      }
  }
    // startDate=dates[0];
    // endDate=dates[dates.length];
    console.log("Name :", name);
    console.log("Weekly time series :", weeklyTimeSeries)
    console.log(dates)
    // var high = timeSeries.map(function (a) { return a["2. high"] });
    var open = unpack(timeSeries, "4. close")
    var low = unpack(timeSeries, "3. low");
    var high = unpack(timeSeries, "2. high");
    var open = unpack(timeSeries, "1. open")
   
    var close = timeSeries.map(function (a) { return a["1. close"] });
  
 
   
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: "high",
      x: dates,
      y: high,
      
      line: {
        color: "#17BECF"
      }
      
    };

    var data = [trace1];

    var layout = {
      grid: {rows: 1, columns: 2, pattern: 'independent'},
      showlegend: false,
      autosize: true,
      // width: 430,
      // height: 400,
      margin: {
        r: 40, 
        t: 30, 
        b: 40, 
        l: 60
      }, 
      xaxis: {
        range: [dates[0], dates[dates.length]],
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
        text: `${ticker} 52 weeks high, low`, 
        font: {
          size: 16,
        //color: 'blue'
        },
        x: 0.3,
        y: 2.2,
        xanchor: 'center',
        yanchor: 'top',
      };
    // layout = go.Layout(title='<b>Bold</b> <i>animals</i>') 
       
    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: "low",
        x: dates,
        y: low,
        line: {
          color: "#ff1a1a"
        }
        
      };
    var data = [trace1, trace2];
    const config = {
      'displayModeBar': false // this is the line that hides the bar.
      
    };
    //   Plotly.newPlot("plot", data, layout); 
    Plotly.newPlot('plot4', data, layout, config);
  });
}

buildPlot();
