from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify



boggle_game = Boggle() #created instace of Boggle class to use in app
app = Flask(__name__)
app.config['SECRET_KEY'] = "abc123"
app.debug = True

highScore = 0

@app.route('/')
def get_boggle_board():
    "Route to generate and get a randon boggle board as HTML"
    nplays = session.get('nplays', 0)
    nplays += 1
    session['nplays'] = nplays

    # Retrieve the high score from the session or set it to 0 if not present
    highScore = session.get('highScore', 0)
    session['highScore']= highScore
    board = boggle_game.make_board()
    session['board']= board
    return render_template("index.html", board=board, highscore=highScore, nplays=nplays)

@app.route('/check-guess', methods=['POST'])
def check_guess():
    # Process the user's guess here
    board = session.get('board')
    user_guess = request.form.get('guess')
    response = boggle_game.check_valid_word(board, user_guess)
    # result = "Valid guess!" if user_guess in board else "Invalid guess!"  NOT NEEDED!
    return jsonify({'result': response}) #purpost of jsonify is to convert response data into JSON format beofre sending to to JS/client- repsonse from server needs to be in JSON
#result from check_valid_word

@app.route('/game-over', methods=['POST'])
def game_over():
    global highScore, nplays
    data = request.json #used to parse the JSON data from the request body and store in data variable
  # Set a breakpoint to inspect request.json
    print(request.json)

    score = data.get('score') #from JSON data in JS axios.post
    nplays = data.get('nplays')# get method of dictionary is used to access the value from data doctionary

    if score > highScore:
        highScore = score
        session['highScore'] = highScore  # Update the session with the new high score

    return jsonify({'highScore': highScore, 'nplays': nplays})
#quotes "" are necessary because JSON requires keys and strings to be enclosed in double quotes. the jsonify function from Flask will automatically convert the dictionary to a JSON response
