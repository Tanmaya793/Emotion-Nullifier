class Config:
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:tana9861751892%40@localhost/emotion_nullifier"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "your_secret_key"
    JWT_SECRET_KEY = "your_jwt_secret_key"
