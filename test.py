from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def test_get_boggle_board(self):
        with app.test_client() as client:
            # Perform a GET request to '/'
            response = client.get('/')

            # Check that the response status code is 200 (OK)
            self.assertEqual(response.status_code, 200)

            # Check that the response contains the board HTML table
            self.assertIn(b'<table class="board">', response.data)
            self.assertIn(b'</table>', response.data)

            # Check that the response contains the "High Score" and "Score" information
            self.assertIn(b'<p>High Score:', response.data)
            self.assertIn(b'<p>Score:', response.data)

    def test_check_guess(self):
        with app.test_client() as client:
            # Perform a POST request to '/check-guess'
            # Add the necessary data in the request to simulate a user's guess
            response = client.post('/check-guess', data={'guess': 'test'})

            # Check that the response status code is 200 (OK)
            self.assertEqual(response.status_code, 200)

            # Get the response data as a JSON object
            response_data = response.get_json()

            # Check that the response data contains the 'result' key
            self.assertIn('result', response_data)

    def test_game_over(self):
        with app.test_client() as client:
            # Perform a POST request to '/game-over'
            # Add the necessary data in the request to simulate the end of the game
            response = client.post('/game-over', json={'score': 10, 'nplays': 1})

            # Check that the response status code is 200 (OK)
            self.assertEqual(response.status_code, 200)

            # Get the response data as a JSON object
            response_data = response.get_json()

            # Check that the response data contains the 'highScore' and 'nplays' keys
            self.assertIn('highScore', response_data)
            self.assertIn('nplays', response_data)

            # Reset the session after each test to avoid interference between tests
            with client.session_transaction() as session:
                session.clear()

