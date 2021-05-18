from flask import Flask, render_template, redirect, jsonify, json, request
from keys import api_key
import re
import requests
from datetime import date, timedelta

# Create an instance of Flask
app = Flask(__name__)

# # Create public URL for localhost:5000 so phone can access undeployed app
# def start_ngrok():
# 	from pyngrok import ngrok
# 	url = ngrok.connect(5000).public_url
# 	print(url)

# start_ngrok()

@app.route("/")
def home():
	return redirect("/index.html")

@app.route("/index.html")
def indexpage():
	account = ['GE', 'IBM', 'AA', "A"]
	try:
		front = []
		stockcount = 0
		for stock in account:
			print(stock)
			card_info = get_card_one(stock)
			card_info["id"] = f"carouselExampleControls{stockcount}"
			front.append(card_info)
			stockcount +=1
			print(front)
		return render_template("testtoo.html", front = front)
	except:
		return render_template("testtoo.html")
	return render_template("testtoo.html")

def get_card_one(ticker):
	function = 'OVERVIEW'
	url = f'https://www.alphavantage.co/query?function={function}&symbol={ticker}&apikey=api_key'
	response = requests.get(url).json()
	front = {}
	front['Ticker'] = ticker
	front['Name'] = response['Name']
	front['About'] = ' '.join(re.split(r'(?<=[.:])\s', response['Description'])[:1])
	front['Location'] = response['Address'].split(",")[1].strip() + ", " + response['Address'].split(",")[2].strip()
	front["Industry"] = response['Sector']
	# function = 'TIME_SERIES_DAILY'
	# url = f'https://www.alphavantage.co/query?function={function}&symbol={ticker}&apikey=api_key'
	# response = requests.get(url).json()
	# usedate = '2021-03-26'
	# front['TradeDate'] = usedate
	# trade = round(float(response['Time Series (Daily)'][usedate]['4. close']),2)
	# print(trade)
	# ### Need to update this for Mondays/Sundays
	# current = round(float(response['Time Series (Daily)'][(date.today()-timedelta(days=3)).strftime("%Y-%m-%d")]['4. close']),2)
	# front['TradePrice'] = trade
	# front['CurrPrice'] = current
	# front['Gain'] = round((current - trade), 2)
	return front





if __name__ == "__main__":
    app.run(debug=True)