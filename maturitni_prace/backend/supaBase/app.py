from flask import Flask
from signInSupaBase import sign_in_blueprint
from logInSupaBase import log_in_blueprint
from nactiHrySupaBase import nacti_hry_blueprint

app = Flask(__name__)

# Registrace Blueprintů
app.register_blueprint(sign_in_blueprint)
app.register_blueprint(log_in_blueprint)
app.register_blueprint(nacti_hry_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
