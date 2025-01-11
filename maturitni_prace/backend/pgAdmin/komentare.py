from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from vytvorDB import Users, Store, Review  # Import modelu Users

komentare_blueprint = Blueprint('komentare', __name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(komentare_blueprint, resources={r"/Komentare": {"origins": "http://localhost:3000"}})

# Připojení k databázi
DATABASE_URL = "postgresql+psycopg2://postgres:1234@localhost/postgres"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@komentare_blueprint.route('/Komentare', methods=['POST'])
def pridej_comment():
    # Získání dat z požadavku
    data = request.get_json()

    comment = data.get('comment')  # Uživatelské jméno nebo email
    game_rating = data.get('rating')
    user = data.get('uzivatel')
    hra = data.get('hra')

    # Debug: Výpis přijatých dat
    print(f"Received data - User: {user}, Game: {hra}, Rating: {game_rating}, Comment: {comment}")

    # Zkontrolujte, zda uživatel existuje podle jména nebo emailu
    session = Session()
    comment_user = session.query(Users).filter(
       (Users.user_name == user)
    ).first()

    if not comment_user:
        session.close()
        return jsonify({'error': 'Pro komentování musíte být přihlašen'}), 400
    
    # Najděte hru, na kterou se komentář vztahuje
    commented_game = session.query(Store).filter(
       (Store.title == hra)
    ).first()

    if not commented_game:
        session.close()
        return jsonify({'error': 'Hra neexistuje'}), 400

    # Vytvoření nového komentáře
    novy_comment = Review(store_id=commented_game.id, user_id=comment_user.id, rating=game_rating, review_text=comment)

    try:
        # Přidání nového komentáře do databáze
        session.add(novy_comment)
        session.commit()  # Pokus o commit změn do DB
        return jsonify({'message': 'Komentář úspěšně vytvořen'}), 201

    except Exception as e:
        session.rollback()  # Pokud nastane chyba, transakce se vrátí zpět
        return jsonify({'error': f'Chyba při vytváření komentáře: {str(e)}'}), 500
    finally:
        session.close()  # Uzavření session
