from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt
from supaBase import Users  # Import modelu Users

log_in_blueprint = Blueprint('log_in', __name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(log_in_blueprint, resources={r"/LogIn": {"origins": "http://localhost:3000"}})

# Připojení k databázi
user = 'postgres'
password = '8ibegPGaMBWu0XGf'
engine = create_engine("postgresql://postgres.korkxhmmqodcytkylngt:8ibegPGaMBWu0XGf@aws-0-eu-central-1.pooler.supabase.com:5432/postgres")
Session = sessionmaker(bind=engine)

@log_in_blueprint.route('/LogIn', methods=['POST'])
def login():
    # Získání dat z požadavku
    data = request.get_json()

    name_or_email = data.get('logIn')  # Uživatelské jméno nebo email
    password = data.get('password')

    if not name_or_email or not password:
        return jsonify({'error': 'Email nebo uživatelské jméno a heslo jsou povinné'}), 400

    # Zkontrolujte, zda uživatel existuje podle jména nebo emailu
    session = Session()
    user = session.query(Users).filter(
        (Users.user_mail == name_or_email) | (Users.user_name == name_or_email)
    ).first()
    session.close()

    if not user:
        return jsonify({'error': 'Uživatel s tímto jménem nebo emailem neexistuje'}), 400

    # Pokud uživatel existuje, zkontrolujeme heslo
    if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'message': 'Úspěšné přihlášení', 'isLoggedIn': True}), 200
    else:
        return jsonify({'error': 'Chybné heslo'}), 400
