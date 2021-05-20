import csv, sys
from datetime import date, timedelta, datetime


def daily_prices():
	stocklist = []
	close = []
	# try for 5 most recent days to cover weekends and unreported days
	for x in range(5):
		recent = (date.today()-timedelta(days=x)).strftime("%Y%m%d")
		filename = f'project/csv/NYSE_{recent}.csv'
		try:
			with open(filename) as csv_file:
				csv_reader = csv.reader(csv_file, delimiter=',')
				for row in csv_reader:
					stocklist.append(row[0])
					close.append(row[5])
			print(recent)
			break
		except:
			e = sys.exc_info()[0]
			print(e)
			print(filename)
			pass
	return stocklist, close, recent

# produce five random stocks from the stocklist
def randomizer(stocklist, close, day):
	from numpy.random import default_rng # use to only select each stock once (no duplicates)
	rng = default_rng()
	cards = rng.choice(len(stocklist), size=5, replace=False)
	newdate = datetime.strptime(day, "%Y%m%d").strftime("%m/%d/%Y")
	all_cards = []
	# card_dict = {}
	# card_list = ['one', 'two', 'three', 'four', 'five']
	for x in range(5):
		card_list = {}
		card_list['Ticker'] = stocklist[cards[x]]
		card_list['TradePrice'] = close[cards[x]]
		card_list['TradeDate'] = newdate
		all_cards.append(card_list)
		# card_dict[f'card_{card_list[x]}_tick'] = stocklist[cards[x]]
		# card_dict[f'card_{card_list[x]}_price'] = close[cards[x]]
		# card_dict[f'card_{card_list[x]}_date'] = newdate
	# return card_dict
	return all_cards

def run_file():
	stocks, close, usedate = daily_prices()
	print(stocks[0])
	answer = randomizer(stocks, close, usedate)
	return answer

run_file()


