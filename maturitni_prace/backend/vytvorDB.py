from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from datetime import datetime

Base = declarative_base()

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(255), unique=True)
    user_mail = Column(String(255), unique=True)
    password = Column(String(255))
    zalozeno = Column(DateTime, default=datetime.utcnow)

    owned_games = relationship('UserGames', back_populates='user')

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
    genre_id = Column(Integer, ForeignKey('genre.id', ondelete='CASCADE'))
    developer_id = Column(Integer, ForeignKey('developer.id', ondelete='CASCADE'))

    genre = relationship('Genre', back_populates='hra')
    developer = relationship('Developer', back_populates='hra')
    owners = relationship('UserGames', back_populates='hra')

engine = create_engine("postgresql+psycopg2://postgres:1234@localhost/postgres")

Session = sessionmaker(bind=engine)
session = Session()

Base.metadata.create_all(engine)

session.commit()

session.close()