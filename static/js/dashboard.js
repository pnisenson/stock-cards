var apiKey = "Z1SWFKTG08NRZOO7";
ticker='AMZN'
var url = 
`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${apiKey}`


function buildPlot() {
    d3.json(url).then(function(data) {

    function unpack(rows, index) {
      return rows.map(function(row) {
        return row[index];
      });
    }
    // Returns: YYYY-MM-DD
    // Grab values from the data json object to build the plots
    var name = data['symbol'];
    var quartReports=data["quarterlyReports"];
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
    //GPF is (Revenue - COGS)/Revenuee
    var grossProfitMargin = totalRevenue.map(function(i, j) {return (i-COGS[j])/i});
    const gpmAvg= grossProfitMargin.reduce((a,b) => a + b, 0)/grossProfitMargin.length
    var grossProfit = totalRevenue.map(function(i, j) {return (i-COGS[j])});
    const gpAvg= grossProfitMargin.reduce((a,b) => a + b, 0)/grossProfit.length
    console.log(gpmAvg)
    console.log(grossProfit)
    console.log(gpAvg)

    // Display charts
    header=[name, display_year, "Revenue"]
    drawChart(header, totalRevenue, dates, 'plot1') 
    header=[name, display_year, "Operating Income"]
    drawChart(header, operatingIncome, dates, 'plot2')
    header=[name, display_year, "Net Income"]
    drawChart(header, netIncome, dates, 'plot3')
    // drawDonut()
    })
}
function drawChart(headerArr, revenueArr, dateArr, id){
  
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
buildPlot();
 