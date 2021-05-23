var apiKey = "Z1SWFKTG08NRZOO7";
ticker='AMZN'
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
    // document.getElementById("headertag").innerHTML = name;
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
    // console.log(opexAvg)
    // Display charts
    // header=[name, display_year, "Revenue"]
    // drawChart(header, totalRevenue, dates, 'plot1') 
    // header=[name, display_year, "Operating Income"]
    // drawChart(header, operatingIncome, dates, 'plot2')
    // header=[name, display_year, "Net Income"]
    // drawChart(header, netIncome, dates, 'plot3');
    drawDonutChart('donut1', gpmAvg, '1');
    drawDonutChart('donut2', opexAvg, '2');
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
/****************************************************************** */
/*              Donut chart                                        */
/***************************************************************** */
  
function drawDonutChart(element, percent, text) {
 //data variables defined
var totalAvail = 100;
console.log("Percent :", percent)
//data
var pieData = [
  {
    value: percent,
    color: '#1607ec',
   },
 {
    value: totalAvail - percent,
    color: '#ff0000',

 },
];


$(document).ready(function(){
  
   //activate chart.js  
   context = document.getElementById(element).getContext('2d');
  var skillsChart = new Chart(context).Doughnut(pieData, {
    //options defined
  	showTooltips: false,
    //segmentShowStroke: false,
    responsive: true,
    percentageInnerCutout: 60,
    animationEasing: 'easeOutQuint',
    animateScale: false,
    //animationSteps: 80,
    
    onAnimationComplete: function() {
        var id = '#' + element;
        var canvasWidthvar = $(id).width();
        var canvasHeight = $(id).height();
        var constant = 85;
        console.log("canvaswid : ",canvasWidthvar)
        console.log("canvasht : ",canvasHeight)
        var fontsize = (canvasHeight/constant).toFixed(2);
        console.log("fontsize :", fontsize);
        context.font=fontsize +"em impact";
        context.textBaseline="middle"; 
      //Print text in the center of the chart
        var tpercentage = (pieData[0].value).toFixed(1)+"%";
        var textWidth = context.measureText(tpercentage).width;
        var txtPosx = Math.round((canvasWidthvar - textWidth)/2);
        console.log("tPosx" , txtPosx)
        context.fillStyle = "#1607ec";
        context.fillText(tpercentage, txtPosx, canvasHeight/2);
      }
       
  
  }); 
  
});
 }
buildPlot();