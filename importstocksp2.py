import sqlite3
import csv

conn = sqlite3.connect("stocknotifier.db")
c = conn.cursor()

with open ('NYSE.csv', newline='') as csvfile:
    stockreader = csv.reader(csvfile)
    firstLine = True
    for row in stockreader:
        if firstLine: #skip header line
            firstLine = False
            continue
        else:
            symbol = row[0]
            security = row[1]
            sector = row[5]
            c.execute("INSERT INTO Stocks (Symbol, Security, Sector)"
                    "VALUES (?,?,?)", 
                    (str(symbol), str(security), str(sector)))

with open ('DOWJONES.csv', newline='') as csvfile:
    stockreader = csv.reader(csvfile)
    firstLine = True
    for row in stockreader:
        if firstLine: #skip header line
            firstLine = False
            continue
        else:
            symbol = row[2]
            security = row[0]
            sector = row[4]
            c.execute("INSERT INTO Stocks (Symbol, Security, Sector)"
                    "VALUES (?,?,?)", 
                    (str(symbol), str(security), str(sector)))

with open ('AMEX.csv', newline='') as csvfile:
    stockreader = csv.reader(csvfile)
    firstLine = True
    for row in stockreader:
        if firstLine: #skip header line
            firstLine = False
            continue
        else:
            symbol = row[0]
            security = row[1]
            sector = row[5]
            c.execute("INSERT INTO Stocks (Symbol, Security, Sector)"
                    "VALUES (?,?,?)", 
                    (str(symbol), str(security), str(sector)))
conn.commit()
