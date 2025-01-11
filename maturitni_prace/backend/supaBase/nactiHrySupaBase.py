from flask import Blueprint, jsonify
from flask_cors import CORS
from supabase import create_client, Client

nacti_hry_blueprint = Blueprint('nacti_hry', __name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(nacti_hry_blueprint, resources={r"/nactiHry": {"origins": "http://localhost:3000"}})

# Připojení k Supabase
url = "https://korkxhmmqodcytkylngt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvcmt4aG1tcW9kY3l0a3lsbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjQ5NzQsImV4cCI6MjA1MjAwMDk3NH0.YMOhfeZ29n6WUNjI7hbdLdkSqx_6nXJK52F_kvwF1rk"
supabase = create_client(url, key)

@nacti_hry_blueprint.route('/nactiHry', methods=['GET'])
def nactiHry():
    try:
        # Načtení dat z tabulky "store" s připojenými informacemi o žánru a vývojáři
        response = supabase.table('store').select('*, genre(genre), developer(developer_name)').execute()

        hry = response.data  # Data získaná z tabulky

        # Seznam pro uložení informací o hrách
        hryData = []
        for hra in hry:
            # Opravený přístup k 'genre' a 'developer' z objektů
            genre = hra['genre']['genre'] if hra.get('genre') else 'Neznámý žánr'
            developer = hra['developer']['developer_name'] if hra.get('developer') else 'Neznámý vývojář'
            price = hra['price'] if hra.get('price') else 'Cena není k dispozici'
            img_url = hra['img'] if hra.get('img') else 'Není k dispozici'

            # Přidání informací o hře do seznamu
            hryData.append({
                "title": hra['title'],
                "price": price,
                "genre": genre,
                "developer": developer,
                "img": img_url
            })

        return jsonify(hryData)  # Vrátí data jako JSON

    except Exception as e:
        # Pokud dojde k chybě, vrátíme odpověď s chybovým kódem a popisem chyby
        print(f"Chyba: {e}")
        return jsonify({"error": str(e)}), 500
