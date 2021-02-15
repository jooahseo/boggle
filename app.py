from flask.templating import render_template_string
from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = 'boggle123'

boggle_game = Boggle()
game_played = 0

@app.route('/')
def home():
    board = boggle_game.make_board()
    session['boardObj'] = board
    return render_template('index.html', board=board)

@app.route('/find/<word>')
def findword(word):
    board = session['boardObj']
    res = boggle_game.check_valid_word(board,word)

    return jsonify(result = res, search_term = word)

@app.route('/endgame', methods=["POST"])
def endgame():
    global game_played
    game_played += 1
    score = request.json['score']
    
    top_score = session.get("topscore",0)
    session['topscore'] = max(score,top_score)
    
    print('server session: ',session)
    if score > top_score:
        answer = True
    else:
        answer = False
    return jsonify(gameCount = game_played, newRecord = answer)

