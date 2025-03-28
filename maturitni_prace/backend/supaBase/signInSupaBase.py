from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from supaBase import Users  # import modelu Users
import bcrypt

sign_in_blueprint = Blueprint('sign_in', __name__)

# Povolení CORS pro všechny domény
CORS(sign_in_blueprint, resources={r"/SignIn": {"origins": "http://localhost:3000"}})

# Připojení k databázi
user = 'postgres'
password = '8ibegPGaMBWu0XGf'
engine = create_engine("postgresql://postgres.korkxhmmqodcytkylngt:8ibegPGaMBWu0XGf@aws-0-eu-central-1.pooler.supabase.com:5432/postgres")
Session = sessionmaker(bind=engine)

@sign_in_blueprint.route('/SignIn', methods=['POST'])
def signup():
    # Získání dat z požadavku
    data = request.get_json()

    name = data.get('user_name')
    email = data.get('email')
    password = data.get('password')

    # Ověření, že email a heslo byly poskytnuty
    if not email or not password:
        return jsonify({'error': 'Email a heslo jsou povinné'}), 400

    # Zkontrolujte, zda uživatel s tímto emailem nebo jménem již existuje
    session = Session()
    existing_user = session.query(Users).filter(
        (Users.user_mail == email) | (Users.user_name == name)
    ).first()

    if existing_user:
        session.close()
        return jsonify({'error': 'Uživatel s tímto e-mailem nebo jménem již existuje'}), 400
    
    # Heslo se zašifruje pomocí bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Vytvoření nové instance uživatele
    new_user = Users(user_name=name, user_mail=email, password=hashed_password.decode('utf-8'))

    try:
        # Přidání nového uživatele do databáze
        session.add(new_user)
        session.commit()  # Pokus o commit změn do DB

        # Po přidání zkontrolujte, jestli uživatel dostal id
        if new_user.id is None:
            return jsonify({'error': 'Chyba při generování ID pro uživatele'}), 500

        print(f"Uživatel byl přidán s ID: {new_user.id}")  # Debugging log
    except Exception as e:
        session.rollback()  # Pokud nastane chyba, transakce se vrátí zpět
        return jsonify({'error': f'Chyba při registraci uživatele: {str(e)}'}), 500
    finally:
        session.close()  # Uzavření session

    return jsonify({'message': 'Uživatel úspěšně zaregistrován', 'user_id': new_user.id}), 201
