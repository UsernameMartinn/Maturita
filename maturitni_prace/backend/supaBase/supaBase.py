from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from datetime import datetime
import bcrypt

Base = declarative_base()

hryData = [
        {
            "title": "The Witcher 3: Wild Hunt",
            "price": 39.99,
            "genre": "Action RPG",
            "developer": "CD Projekt Red",
            "img": '/assets/witcher.jpg'
        },
        {
            "title": "Cyberpunk 2077",
            "price": 59.99,
            "genre": "Action RPG",
            "developer": "CD Projekt Red",
            "img": '/assets/cyber_punk.jpg'
        },
        {
            "title": "Minecraft",
            "price": 26.95,
            "genre": "Sandbox, Survival",
            "developer": "Mojang Studios",
            "img": '/assets/minecraft.jpg'
        },
        {
            "title": "The Legend of Zelda: Breath of the Wild",
            "price": 59.99,
            "genre": "Action-Adventure",
            "developer": "Nintendo",
            "img": '/assets/zelda.jpg'
        },
        {
            "title": "Red Dead Redemption 2",
            "price": 49.99,
            "genre": "Action-Adventure, Open World",
            "developer": "Rockstar Games",
            "img": '/assets/rdd_two.jpg'
        },
        {
            "title": "Grand Theft Auto V",
            "price": 29.99,
            "genre": "Action-Adventure, Open World",
            "developer": "Rockstar North",
            "img": '/assets/gta_V.jpg'
        },
        {
            "title": "Dark Souls III",
            "price": 39.99,
            "genre": "Action RPG",
            "developer": "FromSoftware",
            "img": '/assets/dark_souls_III.jpg'
        },
        {
            "title": "Fortnite",
            "price": "Free-to-play",
            "genre": "Battle Royale, Survival",
            "developer": "Epic Games",
            "img": '/assets/fortnite.jpg'
        },
        {
            "title": "Call of Duty: Modern Warfare II (2022)",
            "price": 69.99,
            "genre": "First-Person Shooter",
            "developer": "Infinity Ward",
            "img": '/assets/CoD_MW_II.jpg'
        }
    ]

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(255), unique=True)
    user_mail = Column(String(255), unique=True)
    password = Column(String(255))
    zalozeno = Column(DateTime, default=datetime.utcnow)

    owned_games = relationship('UserGames', back_populates='user')
    reviews = relationship('Review', back_populates='user')

class Genre(Base):
    __tablename__ = 'genre'

    id = Column(Integer, primary_key=True)
    genre = Column(String(255), unique=True)

    hra = relationship('Store', back_populates='genre')

class Developer(Base):
    __tablename__ = 'developer'

    id = Column(Integer, primary_key=True)
    developer_name = Column(String(255), unique=True)

    hra = relationship('Store', back_populates='developer')

class UserGames(Base):
    __tablename__ = 'user_games'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    store_id = Column(Integer, ForeignKey('store.id', ondelete='CASCADE'), primary_key=True)

    user = relationship('Users', back_populates='owned_games')
    hra = relationship('Store', back_populates='owners')

class Store(Base):
    __tablename__ = 'store'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), unique=True)
    price = Column(Integer)
    img = Column(String(255), unique=True)
    genre_id = Column(Integer, ForeignKey('genre.id', ondelete='CASCADE'))
    developer_id = Column(Integer, ForeignKey('developer.id', ondelete='CASCADE'))

    genre = relationship('Genre', back_populates='hra')
    developer = relationship('Developer', back_populates='hra')
    owners = relationship('UserGames', back_populates='hra')
    reviews = relationship('Review', back_populates='store')

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True)
    store_id = Column(Integer, ForeignKey('store.id', ondelete='CASCADE'))
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    rating = Column(Float)  # Například hodnocení na škále 1-5
    review_text = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Pro like a dislike
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)

    store = relationship('Store', back_populates='reviews')
    user = relationship('Users', back_populates='reviews')

class ReviewInteraction(Base):
    __tablename__ = 'review_interactions'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    review_id = Column(Integer, ForeignKey('reviews.id', ondelete='CASCADE'))
    action = Column(String(10))  # 'like' nebo 'dislike'

    user = relationship('Users')
    review = relationship('Review')

userDB = 'postgres'
passwordDB = '8ibegPGaMBWu0XGf'
engine = create_engine("postgresql://postgres.korkxhmmqodcytkylngt:8ibegPGaMBWu0XGf@aws-0-eu-central-1.pooler.supabase.com:5432/postgres")

Session = sessionmaker(bind=engine)
session = Session()

Base.metadata.create_all(engine)

def insert_hry():
    for hra in hryData:
        genre_data = session.query(Genre).filter_by(genre=hra['genre']).first()

        if not genre_data:
            genre_data = Genre(genre=hra['genre'])
            session.add(genre_data)

        developer_data = session.query(Developer).filter_by(developer_name=hra['developer']).first()

        if not developer_data:
            developer_data = Developer(developer_name=hra['developer'])
            session.add(developer_data)

        store_data = session.query(Store).filter_by(title=hra['title']).first()

        if not store_data:
            # Ošetření ceny, pokud je "Free-to-play", nastaví cenu na 0
            price = hra['price']
            if price == "Free-to-play":
                price = 0  # Nebo jakýkoliv jiný hodnotový přístup
            elif isinstance(price, str):  # Pokud je cena ve formátu string, změňte na 0 nebo číslo
                price = 0
            store = Store(
                title=hra['title'],
                price=price,
                img=hra['img'],
                genre_id=genre_data.id,
                developer_id=developer_data.id
            )
            session.add(store)

    try:
        session.commit()
    except Exception as e:
        session.rollback()  # Vrátí všechny změny v případě chyby
        print(f"Chyba při ukládání do databáze: {e}")

def pridejAdmina():
    password = 'heslo1234'
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    adminExistuje = session.query(Users).filter_by(user_name='admin').first()

    if not adminExistuje:
        admin = Users(user_name='admin', user_mail='admin@domain.com', password=hashed_password.decode('utf-8'))
        session.add(admin)

    try:
        session.commit()
    except Exception as e:
        session.rollback()  # Vrátí všechny změny v případě chyby
        print(f"Chyba při ukládání do databáze: {e}")

insert_hry()
pridejAdmina()

session.close()