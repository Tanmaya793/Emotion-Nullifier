from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from models import db, User, MoodPreference
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app, supports_credentials=True)
jwt = JWTManager(app)

# ----------  Auth endpoints  ---------- #
@app.post("/api/register")
def register():
    data = request.get_json()
    required = {"username", "email", "password"}
    if not required.issubset(data):
        return jsonify({"msg": "Missing fields"}), 400

    if User.query.filter((User.username == data["username"]) |
                         (User.email == data["email"])).first():
        return jsonify({"msg": "User already exists"}), 409

    user = User(username=data["username"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token}), 201


@app.post("/api/login")
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get("username")).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify({"msg": "Bad credentials"}), 401

    return jsonify({"access_token": create_access_token(identity=str(user.id))}), 200

# ----------  Preference endpoint (protected)  ---------- #
@app.route("/api/preferences", methods=["POST"])
@jwt_required()
def save_preferences():
    uid = get_jwt_identity()
    payload = request.get_json()

    allowed_moods = {"stressed", "sad", "angry", "happy", "bored"}

    # Clear existing preferences for this user
    MoodPreference.query.filter_by(user_id=uid).delete()

    for mood, choice in payload.items():
        if mood in allowed_moods:
            pref = MoodPreference(mood=mood, choice=choice, user_id=uid)
            db.session.add(pref)

    db.session.commit()
    return jsonify({"msg": "Preferences saved successfully."}), 200


@app.route("/api/ping")
def ping():
    return jsonify({"msg": "MySQL connected!"})

if __name__ == "__main__":
    app.run(debug=True)
