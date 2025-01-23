from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from vytvorDB import Review, Store  # Import modelu Review

top_hry_blueprint = Blueprint('top_hry', __name__)

# Povolení CORS pro všechny domény
CORS(top_hry_blueprint, resources={r"/top_hry": {"origins": "http://localhost:3000"}})

# Připojení k databázi
DATABASE_URL = "postgresql+psycopg2://postgres:1234@localhost/postgres"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@top_hry_blueprint.route('/top_hry', methods=['POST'])
def najdiTop():
    try:
        print("Požadavek přijat na '/top_hry'")

        # Získání session
        session = Session()

        # Dotaz pro získání průměrného hodnocení pro každý obchod (store)
        top_games = session.query(
            Review.store_id, 
            func.avg(Review.rating).label('average_rating')
        ).join(Store).group_by(Review.store_id) \
         .order_by(func.avg(Review.rating).desc()).limit(10).all()

        print(f"Výsledky dotazu: {top_games}")

        # Pokud nejsou žádné hry
        if not top_games:
            print("Žádné top hry nebyly nalezeny.")
            return jsonify({"message": "Žádné top hry nebyly nalezeny."}), 404

        # Formátování výsledku pro frontend
        response = []
        for game in top_games:
            store = session.query(Store).get(game.store_id)  # Opravený způsob získání obchodu
            if store:
                print(f"Store nalezeno: {store.title}")
            else:
                print(f"Store s id {game.store_id} nebylo nalezeno.")
            
            # Zaokrouhlení průměrného hodnocení na 1 desetinné místo
            average_rating_rounded = round(game.average_rating, 1)

            response.append({
                "store_id": game.store_id,
                "store_name": store.title if store else "Neznámý obchod",
                "average_rating": average_rating_rounded  # Zaokrouhlené hodnocení
            })

        print("Vracíme data top her.")
        return jsonify(response)

    except Exception as e:
        # Zpracování chyb a logování
        print(f"Chyba při zpracování: {e}")
        return jsonify({"error": "Chyba serveru"}), 500
