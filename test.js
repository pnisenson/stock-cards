var api_key = "LLUWTSXUDXC38JV1";

var stocks = ['GE', 'IBM']


function stockData(){
	for (var i = 0; i < stocks.length; i++) {
		var ticker = stocks[i];
		var url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${api_key}`;
		d3.json(url).then(function(data) {
			console.log(data.Description);
		});	
	};
};

var cardholder = d3.select(".card-holder")

function cardBuild(){
	for (var i = 0; i < stocks.length; i++) {
		var org = cardholder.append('div').attr('class', 'col-4');
		var carousel = org.append('div').attr('id', `carouselExampleControls${i}`).attr('class', 'carousel slide').attr('data-bs-interval', 'false').attr('data-bs-ride', 'carousel')
		var inner = carousel.append('div').attr('class', 'carousel-inner')
		var side_one = inner.append('div').attr('class','carousel-item active').append('div').attr('class', 'container').text(stocks[i] + 'side one')
		var side_two = inner.append('div').attr('class','carousel-item').append('div').attr('class', 'container').text(stocks[i] + 'side two')
		var side_three = inner.append('div').attr('class','carousel-item').append('div').attr('class', 'container').text(stocks[i] + 'side three')
		var buttonprev = inner.append('button').attr('class', 'carousel-control-prev').attr('type','button').attr('data-bs-target',`carouselExampleControls${i}`).attr('data-bs-slide','prev')
		var span_one = buttonprev.append('span').attr('class','carousel-control-prev-icon').attr('aria-hidden','true')
		var span_two = buttonprev.append('span').attr('class','visually-hidden').text('Previous')
		var buttonnext = inner.append('button').attr('class', 'carousel-control-next').attr('type','button').attr('data-bs-target',`carouselExampleControls${i}`).attr('data-bs-slide','next')
		var span_three = buttonnext.append('span').attr('class','carousel-control-next-icon').attr('aria-hidden','true')
		var span_four = buttonnext.append('span').attr('class','visually-hidden').text('Next')
		var idlist = []
		idlist.push(`#carouselExampleControls${i}`)
	};
	var myCarousel = document.querySelector(`#carouselExampleControls${i}`)
	var finalcarousel = new bootstrap.Carousel(myCarousel,{
		interval: 20
		});
};

cardBuild()

