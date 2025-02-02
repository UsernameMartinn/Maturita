from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from vytvorDB import Users, Store, Review  # Import modelů

nacti_komentare_blueprint = Blueprint('nacti_komentare', __name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(nacti_komentare_blueprint, resources={r"/nactiHry/*": {"origins": "*"}})

# Připojení k databázi
DATABASE_URL = "postgresql+psycopg2://postgres:1234@localhost/postgres"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@nacti_komentare_blueprint.route('/nactiHry/<title>', methods=['POST', 'GET'])
def nacti_comment(title):
    session = Session()
    
    if request.method == 'GET':
        # Načteme hru podle jejího názvu
        hra = session.query(Store).filter(Store.title == title).first()

        if hra is None:
            return jsonify({"error": "Hra nebyla nalezena"}), 404

        # Načteme komentáře pro danou hru (používáme store_id z modelu Store)
        komentare = session.query(Review).filter(Review.store_id == hra.id).order_by(Review.created_at.desc()).all()

        # Seznam pro uložení informací o komentářích
        seznam_komentaru = []
        for komentar in komentare:
            seznam_komentaru.append({
                "id": komentar.id,
                "rating": komentar.rating,
                "review_text": komentar.review_text,
                "created_at": komentar.created_at,
                "likes": komentar.likes,
                "dislikes": komentar.dislikes,
                "user_name": komentar.user.user_name  # Můžeme přidat i jméno uživatele, pokud to potřebujeme
            })

        session.close()
        return jsonify(seznam_komentaru)  # Vrátí komentáře jako JSON


