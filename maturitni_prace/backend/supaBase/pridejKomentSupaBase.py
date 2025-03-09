from flask import Blueprint, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

# Inicializace blueprintu
pridej_komentare_blueprint = Blueprint('komentare', __name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(pridej_komentare_blueprint, resources={r"/Komentare": {"origins": "http://localhost:3000"}})

# Připojení k Supabase
url = "https://korkxhmmqodcytkylngt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvcmt4aG1tcW9kY3l0a3lsbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjQ5NzQsImV4cCI6MjA1MjAwMDk3NH0.YMOhfeZ29n6WUNjI7hbdLdkSqx_6nXJK52F_kvwF1rk"
supabase = create_client(url, key)

@pridej_komentare_blueprint.route('/Komentare', methods=['POST'])
def pridej_comment():
    # Získání dat z požadavku
    data = request.get_json()

    comment = data.get('comment')  # Uživatelské jméno nebo email
    game_rating = data.get('rating')
    user = data.get('uzivatel')
    hra = data.get('hra')

    # Debug: Výpis přijatých dat
    print(f"Received data - User: {user}, Game: {hra}, Rating: {game_rating}, Comment: {comment}")

    # Zkontrolujte, zda uživatel existuje podle jména
    comment_user_response = supabase.table("users").select("*").filter("user_name", "eq", user).single().execute()

    # Pokud uživatel neexistuje, vrátíme chybu
    if comment_user_response.data is None:
        return jsonify({'error': 'Pro komentování musíte být přihlašen'}), 400

    # Najděte hru, na kterou se komentář vztahuje
    commented_game_response = supabase.table("store").select("*").filter("title", "eq", hra).single().execute()

    # Pokud hra neexistuje, vrátíme chybu
    if commented_game_response.data is None:
        return jsonify({'error': 'Hra neexistuje'}), 400

    # Vytvoření nového komentáře
    user_id = comment_user_response.data["id"]
    store_id = commented_game_response.data["id"]

    try:
        # Přidání nového komentáře do databáze
        supabase.table("reviews").insert({
            "store_id": store_id,
            "user_id": user_id,
            "rating": game_rating,
            "review_text": comment,
        }).execute()

        return jsonify({'message': 'Komentář úspěšně vytvořen'}), 201

    except Exception as e:
        return jsonify({'error': f'Chyba při vytváření komentáře: {str(e)}'}), 500
