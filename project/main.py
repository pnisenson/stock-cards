from flask import Blueprint, render_template, json, request
from . import db
from flask_login import login_required, current_user as cu
import requests
import re
from datetime import date, timedelta
# from flask import Flask, render_template, redirect, jsonify, json, request

main = Blueprint('main', __name__)

@main.route('/')
def index():
	return render_template('index.html')

@main.route('/profile')
def profile():
	try:
		tickers = cu.cards
		front = []
		stockcount = 0
		for stock in tickers:
			tick_symbol = stock["Ticker"]
			print(tick_symbol)
			card_info = get_card_one(tick_symbol)
			card_info["id"] = f"carouselExampleControls{stockcount}"
			card_info["Ticker"] = stock["Ticker"]
			card_info["TradeDate"] = stock["TradeDate"]
			card_info["TradeDate"] = stock["TradePrice"]
			front.append(card_info)
			stockcount +=1
		# print(front)
		return render_template("profile.html", front = front)
	except:
		return render_template("profile.html")
	return render_template("profile.html")
	return render_template('profile.html')

def get_card_one(ticker):
	function = 'OVERVIEW'
	url = f'https://www.alphavantage.co/query?function={function}&symbol={ticker}&apikey=LLUWTSXUDXC38JV1'
	response = requests.get(url).json()
	print(response)
	front = {}
	front['Name'] = response['Name']
	print('Name')
	front['About'] = ' '.join(re.split(r'(?<=[.:])\s', response['Description'])[:1])
	print('About')
	front['Location'] = response['Address'].split(",")[1].strip() + ", " + response['Address'].split(",")[2].strip()
	print("Loc")
	front["Industry"] = response['Sector']
	print(front)
	return front