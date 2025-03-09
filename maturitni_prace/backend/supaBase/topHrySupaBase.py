from flask import Blueprint, jsonify
from flask_cors import CORS
from supabase import create_client

top_hry_blueprint = Blueprint('top_hry', __name__)

# Povolení CORS pro všechny domény
CORS(top_hry_blueprint, resources={r"/top_hry": {"origins": "http://localhost:3000"}})

# Připojení k Supabase
url = "https://korkxhmmqodcytkylngt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvcmt4aG1tcW9kY3l0a3lsbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjQ5NzQsImV4cCI6MjA1MjAwMDk3NH0.YMOhfeZ29n6WUNjI7hbdLdkSqx_6nXJK52F_kvwF1rk"
supabase = create_client(url, key)

@top_hry_blueprint.route('/top_hry', methods=['GET'])
def najdiTop():
    try:
        # Nejprve získáme základní data o hrách z tabulky 'store'
        response = supabase.table('store').select('id, title, img, genre_id, price').execute()

        top_hry = response.data

        # Načítání průměrného hodnocení pro každou hru z tabulky 'review'
        for hra in top_hry:
            review_response = supabase.table('reviews') \
                .select('rating') \
                .eq('store_id', hra['id']) \
                .execute()

            # Výpočet průměrného hodnocení
            ratings = [r['rating'] for r in review_response.data]
            average_rating = sum(ratings) / len(ratings) if ratings else 0

            hra['average_rating'] = average_rating

            # Načítání žánru pro každou hru z tabulky 'genre'
            genre_response = supabase.table('genre') \
                .select('genre') \
                .eq('id', hra['genre_id']) \
                .single() \
                .execute()

            hra['genre'] = genre_response.data['genre']

        # Seřadíme hry podle průměrného hodnocení
        top_hry = sorted(top_hry, key=lambda x: x['average_rating'], reverse=True)[:10]

        top_hry_data = [
            {
                "id": hra['id'],
                "title": hra['title'],
                "img": hra['img'],
                "average_rating": hra['average_rating'],
                "genre": hra['genre'],
                "price": hra['price']
            }
            for hra in top_hry
        ]

        return jsonify(top_hry_data)

    except Exception as e:
        print(f"Error occurred: {e}")  # Přidání logování chyby pro lepší debugování
        return jsonify({"error": str(e)}), 500