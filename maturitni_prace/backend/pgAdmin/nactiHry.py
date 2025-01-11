from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Maturita.Maturita.maturitni_prace.backend.pgAdmin.vytvorDB import Store, Genre, Developer

app = Flask(__name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(app, resources={r"/nactiHry": {"origins": "http://localhost:3000"}})

# Připojení k databázi
DATABASE_URL = "postgresql+psycopg2://postgres:1234@localhost/postgres"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@app.route('/nactiHry', methods=['GET'])
def nactiHry():
    session = Session()
    hry = session.query(Store).all()  # Získání všech her

    # Seznam pro uložení informací o hrách
    hryData = []
    for hra in hry:
        genre = hra.genre.genre if hra.genre else 'Neznámý žánr'
        developer = hra.developer.developer_name if hra.developer else 'Neznámý vývojář'
        price = hra.price if hra.price else 'Cena není k dispozici'
        img_url = hra.img if hra.img else 'Není k dispozici'

        # Přidání informací o hře do seznamu
        hryData.append({
            "title": hra.title,
            "price": price,
            "genre": genre,
            "developer": developer,
            "img": img_url
        })
    
    session.close()
    return jsonify(hryData)  # Vrátí data jako JSON

if __name__ == '__main__':
    app.run(debug=True)