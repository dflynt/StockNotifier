from flask import Flask, g
import smtplib
import uuid
from flask_bootstrap import Bootstrap
import sqlite3

app = Flask(__name__)
app.config.update(dict(SECRET_KEY="powerful secretkey", WTF_CSRF_SECRET_KEY="a secret key"))
Bootstrap(app)
s = smtplib.SMTP('smtp.gmail.com', 587)
# start TLS for security
s.starttls()
s.login("danielflynt1@gmail.com", "Twentyone21!@#")
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
            SellPrice INT,
            BuyPrice INT,
            FOREIGN KEY (ID) REFERENCES Users(ID))''')
c.execute('''CREATE TABLE IF NOT EXISTS Stocks (
            Security VARCHAR(30),
            Symbol CHAR(5)
            )''')
conn.commit()

def insertNewUser(firstName, lastName, email, password, phone, AccConfirmed):
    token = uuid.uuid5(uuid.NAMESPACE_URL, email)
    c.execute("SELECT * FROM Users WHERE ID =?", (str(token),))
    result = c.fetchone()
    if result is None: #not in the database yet
            c.execute("INSERT INTO Users (ID, FirstName, LastName, Email,"
                    "Passw, Phone, AccConfirmed) VALUES (?,?,?,?,?,?,?)", 
                    (str(token), firstName, lastName, email, password, str(phone), AccConfirmed))
            conn.commit()
            return str(token)
    else:
        return -1 #user already in database

def showUsers():
    c.execute("SELECT * FROM Users")
    row = c.fetchone()
    return row[0] + " " + row[1] + " " + row[2]
    conn.commit()

def loginUser(email, password):
    c.execute("SELECT * FROM Users WHERE email = ?", (email,))
    row = c.fetchone()
    if row:
        if row[4] == password: #if password matches password in the DB
            return row[0] #return the token for future use
        else:
            return -1 #error code
    else:
        return -1

def checkStockDBWithInput(input):
    c.execute("SELECT * FROM Stocks WHERE Symbol LIKE ? OR Security LIKE ? LIMIT 5", (input+"%", "%"+input+"%"))
    results = c.fetchall()
    return results

def addStockToUserList(input, token):
    c.execute("SELECT * FROM UserSettings WHERE ID = ? AND Symbol = ? ", (token, input))
    results = c.fetchall()
    if not results:
        c.execute("INSERT INTO UserSettings (ID, Symbol) VALUES (?,?)", (token, input))
        conn.commit()
        return input
    return False

def returnStockList(token):
    c.execute("SELECT Symbol FROM UserSettings WHERE ID = ?", (token,))
    results = c.fetchall()
    c.execute("SELECT FirstName FROM Users WHERE ID = ?", (token,))
    name = c.fetchall()
    results = name + results
    if results:
        return results 
    else:
        return False

def sendEmailToAlertUser(token, reason):
    c.execute("SELECT Email from Users WHERE ID = ?", (token,))
    email = c.fetchone()

    message = reason
    s.sendmail("danielflynt1@gmail.com", "danielflynt1@gmail.com", message)
    s.quit()

from . import views