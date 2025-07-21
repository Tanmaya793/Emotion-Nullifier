from flask_sqlalchemy import SQLAlchemy
from passlib.hash import argon2

db = SQLAlchemy()

class User(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email    = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Argon2 hash

    def set_password(self, plaintext):
        self.password = argon2.hash(plaintext)  # Argon2id default

    def check_password(self, plaintext):
        return argon2.verify(plaintext, self.password)

class MoodPreference(db.Model):
    id        = db.Column(db.Integer, primary_key=True)
    mood      = db.Column(db.String(20), nullable=False)      # sad / happy …
    choice    = db.Column(db.String(50), nullable=False)      # Music / Games …
    user_id   = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    user      = db.relationship("User", backref="preferences")
