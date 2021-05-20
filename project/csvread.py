import csv, sys
from datetime import date, timedelta, datetime
import requests


def daily_prices():
	stocklist = []
	close = []
	# try for 5 most recent days to cover weekends and unreported days
	for x in range(5):
		recent = (date.today()-timedelta(days=x)).strftime("%Y%m%d")
		# #when running file not in project
		# filename = f'csv/NYSE_{recent}.csv'
		#when running file as part of run_file within project
		filename = f'project/csv/NYSE_{recent}.csv'
		try:
			with open(filename) as csv_file:
				csv_reader = csv.reader(csv_file, delimiter=',')
				next(csv_reader, None) #skips header
				for row in csv_reader:
					if "." not in row[0] and "-" not in row[0]:
						stocklist.append(row[0])
						close.append(row[5])
			# print(stocklist)
			break
		except:
			e = sys.exc_info()
			print(e)
			print(filename)
			pass
	return stocklist, close, recent

# produce five random stocks from the stocklist
def randomizer(stocklist, close, day):
	from numpy.random import default_rng # use to only select each stock once (no duplicates)
	rng = default_rng()
	cards = rng.choice(len(stocklist), size=50, replace=False)
	newdate = datetime.strptime(day, "%Y%m%d").strftime("%m/%d/%Y")
	all_cards = []
	x = 0
	# for x in range(50):
	while len(all_cards) < 5:
		ticker = stocklist[cards[x]]
		url = f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={ticker}&apikey=LLUWTSXUDXC38JV1'
		try:
			response = requests.get(url).json()
			response['Name']
			print(response['Name'])
			card_list = {}
			card_list['Ticker'] = ticker
			card_list['TradePrice'] = close[cards[x]]
			card_list['TradeDate'] = newdate
			all_cards.append(card_list)
			x += 1
		except:
			x += 1
			pass
	return all_cards

def run_file():
	stocks, close, usedate = daily_prices()
	print(stocks[0])
	answer = randomizer(stocks, close, usedate)
	return answer

# run_file()
# daily_prices()

def latest_close(ticker):
	# try for 5 most recent days to cover weekends and unreported days
	for x in range(5):
		recent = (date.today()-timedelta(days=x)).strftime("%Y%m%d")
		# #when running file not in project
		# filename = f'csv/NYSE_{recent}.csv'
		#when running file as part of run_file within project
		filename = f'project/csv/NYSE_{recent}.csv'
		try:
			with open(filename) as csv_file:
				csv_reader = csv.reader(csv_file, delimiter=',')
				next(csv_reader, None) #skips header
				for row in csv_reader:
					if ticker == row[0]:
						print(row[5])
						print(type(row[5]))
						return round(float(row[5]),2)
						break
		except:
			e = sys.exc_info()
			print(e)
			print(filename)
			pass

