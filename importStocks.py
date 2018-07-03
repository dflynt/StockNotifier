import sqlite3
import csv

conn = sqlite3.connect("stocknotifier.db")
c = conn.cursor()
c.execute("DROP TABLE IF EXISTS Stocks")
c.execute('''CREATE TABLE IF NOT EXISTS Stocks (
            Symbol VARCHAR(30),
            Security CHAR(5),
            Sector VARCHAR(30))''')

with open ('IEXStockList.csv', newline='') as csvfile:
    stockreader = csv.reader(csvfile)
    firstLine = True
    for row in stockreader:
        if firstLine: #skip header line
            firstLine = False
            continue
        else:
            symbol = row[0]
            security = row[2]
            c.execute("INSERT INTO Stocks (Symbol, Security)"
                    "VALUES (?,?)", 
                    (str(symbol), str(security)))

conn.commit()
