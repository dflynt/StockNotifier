from flask import Flask, g
import uuid
from flask_bootstrap import Bootstrap
import sqlite3

app = Flask(__name__)
app.config.update(dict(SECRET_KEY="powerful secretkey", WTF_CSRF_SECRET_KEY="a secret key"))
Bootstrap(app)
conn = sqlite3.connect("stocknotifier.db", check_same_thread=False)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS Users (
            ID VARCHAR(35), 
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

def insertNewUser(firstName, lastName, email, password, phone, AccConfirmed):
    token = uuid.uuid5(uuid.NAMESPACE_URL, "danielflynt1@gmail.com")
    strToken = email
    c.execute("SELECT * FROM Users WHERE ID =?", (str(token),))
    ##
    alreadyRegistered = c.fetchone()[0]
    if not alreadyRegistered:
        c.execute("INSERT INTO Users (ID, FirstName, LastName, Email,"
                "Passw, Phone, AccConfirmed) VALUES (?,?,?,?,?,?,?)", 
                (str(token), firstName, lastName, email, password, str(phone), AccConfirmed))
        conn.commit()
        return True
    else:
        return False
def showUsers():
    c.execute("SELECT * FROM Users")
    row = c.fetchone()
    return row[0] + " " + row[1] + " " + row[2]
    conn.commit()

def loginUser(email, password):
    c.execute("SELECT * FROM Users WHERE email = ?", (email,))
    row = c.fetchone()
    if row:
        if row[4] == password:
            return True
        else:
            return False
    else:
        return False
from . import views