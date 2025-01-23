from flask import Flask
from signIn import sign_in_blueprint
from logIn import log_in_blueprint
from nactiHry import nacti_hry_blueprint
from pridejKoment import pridej_komentare_blueprint
from nactiKoment import nacti_komentare_blueprint
from likes_dislikes import likes_dislikes_blueprint
from topHry import top_hry_blueprint

app = Flask(__name__)

# Registrace Blueprintů
app.register_blueprint(sign_in_blueprint)
app.register_blueprint(log_in_blueprint)
app.register_blueprint(nacti_hry_blueprint)
app.register_blueprint(pridej_komentare_blueprint)
app.register_blueprint(nacti_komentare_blueprint)
app.register_blueprint(likes_dislikes_blueprint)
app.register_blueprint(top_hry_blueprint)

if __name__ == '__main__':
    app.run(debug=True)