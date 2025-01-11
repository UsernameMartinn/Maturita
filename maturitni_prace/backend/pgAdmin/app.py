from flask import Flask
from signIn import sign_in_blueprint
from logIn import log_in_blueprint
from nactiHry import nacti_hry_blueprint
from komentare import komentare_blueprint

app = Flask(__name__)

# Registrace Blueprintů
app.register_blueprint(sign_in_blueprint)
app.register_blueprint(log_in_blueprint)
app.register_blueprint(nacti_hry_blueprint)
app.register_blueprint(komentare_blueprint)

if __name__ == '__main__':
    app.run(debug=True)