from flask import Blueprint, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from vytvorDB import Review, Store, Genre  # Přidání Genre pro získání žánru

top_hry_blueprint = Blueprint('top_hry', __name__)

# Povolení CORS pro všechny domény
CORS(top_hry_blueprint, resources={r"/top_hry": {"origins": "http://localhost:3000"}})

# Připojení k databázi
DATABASE_URL = "postgresql+psycopg2://postgres:1234@localhost/postgres"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@top_hry_blueprint.route('/top_hry', methods=['GET'])
def najdiTop():
    session = Session()
    
    # Dotaz na získání 10 her s nejvyšším průměrným hodnocením
    top_hry = session.query(
        Store.id,
        Store.title,
        Store.img,
        func.coalesce(func.avg(Review.rating), 0).label('average_rating'),
        Genre.genre,  # Přidání žánru
        Store.price  # Přidání ceny
    ).join(Review, Store.id == Review.store_id) \
     .join(Genre, Store.genre_id == Genre.id) \
     .group_by(Store.id, Genre.id) \
     .order_by(func.avg(Review.rating).desc()) \
     .limit(10).all()

    session.close()

    # Formátování dat pro frontend
    top_hry_data = [
        {
            "id": hra[0],
            "title": hra[1],
            "img": hra[2],
            "average_rating": float(hra[3]),
            "genre": hra[4],  # Přidání žánru
            "price": hra[5]  # Přidání ceny
        }
        for hra in top_hry
    ]

    return jsonify(top_hry_data)
