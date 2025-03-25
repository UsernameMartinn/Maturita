from flask import Blueprint, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from datetime import datetime

# Inicializace blueprintu
nacti_komentare_blueprint = Blueprint('nacti_komentare', __name__)

# Povolení CORS pro všechny domény
CORS(nacti_komentare_blueprint, resources={r"/*": {"origins": "*"}})

# Připojení k Supabase
url = "https://korkxhmmqodcytkylngt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvcmt4aG1tcW9kY3l0a3lsbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjQ5NzQsImV4cCI6MjA1MjAwMDk3NH0.YMOhfeZ29n6WUNjI7hbdLdkSqx_6nXJK52F_kvwF1rk"
supabase = create_client(url, key)

# Route pro načítání komentářů
@nacti_komentare_blueprint.route('/nactiHry/<title>', methods=['POST', 'GET'])
def nacti_comment(title):
    if request.method == 'GET':
        # Načteme hru podle jejího názvu
        hra = supabase.table("store").select("*").filter("title", "eq", title).single().execute()

        # Zkontrolujeme, jestli byla hra nalezena
        if hra.data is None:
            return jsonify({"error": "Hra nebyla nalezena"}), 404

        hra_data = hra.data  # Opraveno: přístup k `data` přes `.data`, ne přes `["data"]`
        store_id = hra_data["id"]

        # Načteme komentáře pro danou hru (používáme store_id z modelu Store)
        #komentare = supabase.table("reviews").select("*").filter("store_id", "eq", store_id).order("created_at", desc=True).execute()

        komentare = supabase.from_("reviews").select('id, rating, review_text, created_at, likes, dislikes, users(id, user_name, user_mail)').filter("store_id", "eq", store_id).order("created_at", desc=True).execute()


        # Zkontrolujeme, jestli byly komentáře nalezeny
        if komentare.data is None:
            return jsonify({"message": "Žádné komentáře pro tuto hru"}), 404

        # Seznam pro uložení informací o komentářích
        seznam_komentaru = []
        for komentar in komentare.data:
            seznam_komentaru.append({
                "id": komentar["id"],
                "rating": komentar["rating"],
                "review_text": komentar["review_text"],
                "created_at": komentar["created_at"],
                "likes": komentar["likes"],
                "dislikes": komentar["dislikes"],
                "user_name": komentar["users"]["user_name"]  # Použijeme get pro případ, že user_name není dostupné
            })

        return jsonify(seznam_komentaru)  # Vrátí komentáře jako JSON
