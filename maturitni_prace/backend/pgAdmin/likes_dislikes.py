from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from vytvorDB import Review, ReviewInteraction, Users

likes_dislikes_blueprint = Blueprint('likes_dislikes', __name__)

# Povolení CORS pro všechny domény (povolit přístup z localhost:3000)
CORS(likes_dislikes_blueprint, resources={r"/LikesDislikes": {"origins": "http://localhost:3000"}})

# Připojení k databázi
DATABASE_URL = "postgresql+psycopg2://postgres:1234@localhost/postgres"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

@likes_dislikes_blueprint.route('/LikesDislikes', methods=['POST'])
def like_comment():
    session = Session()
    try:
        # Načteme ID komentáře, akci (like/dislike) a user_name
        data = request.get_json()
        review_id = data.get('review_id')
        action = data.get('action')  # 'like' nebo 'dislike'
        user_name = data.get('user_id')  # Předpokládáme, že místo user_id je zde uživatelské jméno

        # Získáme user_id podle user_name
        user = session.query(Users).filter_by(user_name=user_name).first()
        if not user:
            return jsonify({'error': 'Uživatel neexistuje'}), 404
        
        user_id = user.id  # Předpokládáme, že 'id' je primární klíč uživatele

        # Zkontrolujeme, jestli uživatel tento komentář již nelajkoval/dislajkoval
        existing_interaction = session.query(ReviewInteraction).filter_by(user_id=user_id, review_id=review_id).first()

        if existing_interaction:
            # Pokud existuje interakce, zjistíme, co uživatel předtím vybral
            previous_action = existing_interaction.action
            
            if previous_action == action:
                # Pokud uživatel zvolil stejnou akci jako dříve, nic neměníme
                return jsonify({'message': 'Uživatel již tento komentář označil tímto způsobem.'}), 200
            
            # Pokud uživatel zvolil jinou akci (změna z like na dislike nebo naopak), upravíme počty
            review = session.query(Review).filter_by(id=review_id).first()
            if not review:
                return jsonify({'error': 'Komentář neexistuje'}), 404

            # Odečteme předchozí akci
            if previous_action == 'like':
                review.likes -= 1
            elif previous_action == 'dislike':
                review.dislikes -= 1

            # Přičteme novou akci
            if action == 'like':
                review.likes += 1
            elif action == 'dislike':
                review.dislikes += 1
            else:
                return jsonify({'error': 'Neplatná akce'}), 400

            # Aktualizujeme interakci uživatele v databázi
            existing_interaction.action = action
            session.commit()

            return jsonify({'message': 'Úspěšně změněno!'}), 200

        else:
            # Pokud uživatel ještě nehlasoval, přičteme nový like nebo dislike
            review = session.query(Review).filter_by(id=review_id).first()
            if not review:
                return jsonify({'error': 'Komentář neexistuje'}), 404

            if action == 'like':
                review.likes += 1
            elif action == 'dislike':
                review.dislikes += 1
            else:
                return jsonify({'error': 'Neplatná akce'}), 400

            # Uložení nové interakce
            new_interaction = ReviewInteraction(user_id=user_id, review_id=review_id, action=action)
            session.add(new_interaction)

            session.commit()
            return jsonify({'message': 'Úspěšně přidáno!'}), 200

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
