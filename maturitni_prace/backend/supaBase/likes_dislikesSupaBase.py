from flask import Blueprint, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

# Inicializace blueprintu
likes_dislikes_blueprint = Blueprint('likes_dislikes', __name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(likes_dislikes_blueprint, resources={r"/LikesDislikes": {"origins": "http://localhost:3000"}})

# Připojení k Supabase
url = "https://korkxhmmqodcytkylngt.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvcmt4aG1tcW9kY3l0a3lsbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjQ5NzQsImV4cCI6MjA1MjAwMDk3NH0.YMOhfeZ29n6WUNjI7hbdLdkSqx_6nXJK52F_kvwF1rk"
supabase = create_client(url, key)

@likes_dislikes_blueprint.route('/LikesDislikes', methods=['POST'])
def like_comment():
    try:
        # Načteme ID komentáře, akci (like/dislike) a user_name
        data = request.get_json()
        print(f"Received data: {data}")
        review_id = data.get('review_id')
        action = data.get('action')  # 'like' nebo 'dislike'
        user_name = data.get('user_id')  # Používáme user_name místo user_id

        if not review_id or not action or not user_name:
            return jsonify({'error': 'Chybí potřebná data'}), 400

        # Získáme user_id podle user_name
        user = supabase.table("users").select("id").filter("user_name", "eq", user_name).execute()
        if not user.data or len(user.data) != 1:
            return jsonify({'error': 'Uživatel neexistuje nebo je více uživatelů se stejným jménem'}), 404
        
        user_id = user.data[0]["id"]  # Získáme ID uživatele podle user_name

        # Zkontrolujeme, jestli uživatel tento komentář již nelajkoval/dislajkoval
        existing_interaction = supabase.table("review_interactions").select("*").filter("user_id", "eq", user_id).filter("review_id", "eq", review_id).execute()

        if existing_interaction.data:
            # Pokud existuje interakce, zjistíme, co uživatel předtím vybral
            previous_action = existing_interaction.data[0]["action"]
            
            if previous_action == action:
                # Pokud uživatel zvolil stejnou akci jako dříve, nic neměníme
                return jsonify({'message': 'Uživatel již tento komentář označil tímto způsobem.'}), 200
            
            # Pokud uživatel zvolil jinou akci (změna z like na dislike nebo naopak), upravíme počty
            review = supabase.table("reviews").select("*").filter("id", "eq", review_id).execute()
            if not review.data or len(review.data) != 1:
                return jsonify({'error': 'Komentář neexistuje'}), 404

            # Představíme hodnoty likes a dislikes, přičemž je nastavíme na 0, pokud jsou None
            new_likes = review.data[0]["likes"] if review.data[0]["likes"] is not None else 0
            new_dislikes = review.data[0]["dislikes"] if review.data[0]["dislikes"] is not None else 0
            
            if previous_action == 'like':
                new_likes -= 1
            elif previous_action == 'dislike':
                new_dislikes -= 1

            # Přičteme novou akci
            if action == 'like':
                new_likes += 1
            elif action == 'dislike':
                new_dislikes += 1
            else:
                return jsonify({'error': 'Neplatná akce'}), 400

            # Aktualizujeme komentář
            supabase.table("reviews").update({
                "likes": new_likes,
                "dislikes": new_dislikes
            }).filter("id", "eq", review_id).execute()

            # Aktualizujeme interakci uživatele v databázi
            supabase.table("review_interactions").update({
                "action": action
            }).filter("user_id", "eq", user_id).filter("review_id", "eq", review_id).execute()

            return jsonify({'message': 'Úspěšně změněno!'}), 200

        else:
            # Pokud uživatel ještě nehlasoval, přičteme nový like nebo dislike
            review = supabase.table("reviews").select("*").filter("id", "eq", review_id).execute()
            if not review.data or len(review.data) != 1:
                return jsonify({'error': 'Komentář neexistuje'}), 404

            # Představíme hodnoty likes a dislikes, přičemž je nastavíme na 0, pokud jsou None
            new_likes = review.data[0]["likes"] if review.data[0]["likes"] is not None else 0
            new_dislikes = review.data[0]["dislikes"] if review.data[0]["dislikes"] is not None else 0

            if action == 'like':
                new_likes += 1
                supabase.table("reviews").update({"likes": new_likes}).filter("id", "eq", review_id).execute()
            elif action == 'dislike':
                new_dislikes += 1
                supabase.table("reviews").update({"dislikes": new_dislikes}).filter("id", "eq", review_id).execute()
            else:
                return jsonify({'error': 'Neplatná akce'}), 400

            # Uložení nové interakce
            supabase.table("review_interactions").insert({
                "user_id": user_id,
                "review_id": review_id,
                "action": action
            }).execute()

            return jsonify({'message': 'Úspěšně přidáno!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
