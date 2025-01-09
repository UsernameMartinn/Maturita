from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(app, resources={r"/nactiHry": {"origins": "http://localhost:3000"}})

# Připojení k Supabase
url = "https://aws-0-eu-central-1.pooler.supabase.com"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvcmt4aG1tcW9kY3l0a3lsbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjQ5NzQsImV4cCI6MjA1MjAwMDk3NH0.YMOhfeZ29n6WUNjI7hbdLdkSqx_6nXJK52F_kvwF1rk"
supabase: Client = create_client(url, key)

@app.route('/nactiHry', methods=['GET'])
def nactiHry():
    # Načtení dat z tabulky "store"
    try:
        response = supabase.table('store').select('*').execute()
        if response.status_code != 200:
            raise Exception(f"Chyba při načítání dat: {response.status_code}")
    except Exception as e:
        print(f"Chyba: {e}")
    return jsonify({"error": str(e)}), 500

    if response.status_code != 200:
        return jsonify({"error": "Chyba při získávání dat z databáze"}), 500

    hry = response.data  # Data získaná z tabulky

    # Seznam pro uložení informací o hrách
    hryData = []
    for hra in hry:
        genre = hra['genre'] if hra.get('genre') else 'Neznámý žánr'
        developer = hra['developer'] if hra.get('developer') else 'Neznámý vývojář'
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

if __name__ == '__main__':
    app.run(debug=True)
