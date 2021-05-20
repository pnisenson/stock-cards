from flask import Blueprint, render_template
from . import db
from flask_login import login_required, current_user as cu

main = Blueprint('main', __name__)

@main.route('/')
def index():
	return render_template('index.html')

@main.route('/profile')
def profile():
	print(cu[0])
	tickers = [cu.card_one_tick, cu.card_two_tick, cu.card_three_tick, cu.card_four_tick, cu.card_five_tick]
	# try:
	# 	front = []
	# 	stockcount = 0
	# 	for stock in tickers:
	# 		print(stock)
	# 		card_info = get_card_one(stock)
	# 		card_info["id"] = f"carouselExampleControls{stockcount}"
	# 		front.append(card_info)
	# 		stockcount +=1
	# 		print(front)
	return render_template('profile.html')