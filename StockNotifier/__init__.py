from flask import Flask
from flask_bootstrap import Bootstrap
import MySQLdb

app = Flask(__name__)
app.config.update(dict(SECRET_KEY="powerful secretkey", WTF_CSRF_SECRET_KEY="a secret key"))
Bootstrap(app)

def connection():
    conn = MySQLdb.connect(
        host="localhost",
        user="root",
        password="stocks",
        db="stocknotifierdb"
    )
    c = conn.cursor()
    return c, conn

c, conn = connection()

from . import views