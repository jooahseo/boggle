from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_game_board(self):
        """Test if main page loads"""
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)
            
            self.assertEqual(res.status_code,200)
            self.assertIn('<p>Please type your word</p>',html)

    def test_find_word(self):
        """Test if a word is valid from session board"""
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['boardObj'] = [["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"], 
                                    ["C", "A", "T", "T", "T"]]
        response = client.get('/find/cat')
        self.assertEqual(response.json['result'], 'ok')

    def test_score(self):
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['topscore'] = 10
        
        resp = client.post('/endgame', json={'score':3})
        self.assertEqual(resp.json['newRecord'],False)

    def test_new_score(self):
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['topscore'] = 3
        
        resp = client.post('/endgame', json={'score':10})
        self.assertEqual(resp.json['newRecord'],True)