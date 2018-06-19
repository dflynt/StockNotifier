from flask import Flask, g
import uuid
from flask_bootstrap import Bootstrap
import sqlite3

app = Flask(__name__)
app.config.update(dict(SECRET_KEY="powerful secretkey", WTF_CSRF_SECRET_KEY="a secret key"))
Bootstrap(app)
conn = sqlite3.connect("stocknotifier.db")
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS Users (
            ID VARCHAR(30), 
            FirstName TEXT, 
            LastName TEXT, 
            Email TEXT, 
            Passw TEXT, 
            Phone CHAR(10), 
            AccConfirmed TINYINT(1),
            PRIMARY KEY (ID))''')
c.execute('''CREATE TABLE IF NOT EXISTS UserSettings (
            ID VARCHAR(30), 
            Symbol CHAR(5),
            FOREIGN KEY (ID) REFERENCES Users(ID))''')
conn.commit()


from . import views