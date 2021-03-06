from . import app, c, conn
from . import createSellThreshold, createBuyThreshold, sendEmailToAlertUser, returnStockList, addStockToUserList, insertNewUser, showUsers, loginUser, checkStockDBWithInput
from flask import jsonify, render_template, request, url_for, render_template_string, redirect, session
from .forms import RegisterForm, LoginForm, AddStockForm
#views = Blueprint("views", __name__, template_folder="templates")

@app.route('/')
def index():
    if 'tokenID' in session:
        return redirect(url_for("dashboard", uuid=session['tokenID']))
    else:
        return render_template("home.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        firstName = request.form['firstName']
        lastName = request.form['lastName']
        email = request.form['email']
        password = request.form['password']
        phone = request.form['phone']
        tokenForNewUser = insertNewUser(str(firstName), str(lastName), str(email), str(password), str(phone), "0")
        if tokenForNewUser != -1: #-1 error code meaning email already taken
            session['tokenID'] = tokenForNewUser
            return redirect(url_for("dashboard", uuid=tokenForNewUser))
        else:
            return render_template_string("<h5>Already registered</h5>")
    else:
        return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        token = loginUser(email, password)
        if token != -1: #-1 error code meaning email/password combo incorrect
            session['tokenID'] = token
            return redirect(url_for("dashboard", uuid=token))
        else:
            return render_template_string("<h5>Invalid login</h5>")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop('tokenID', None)
    return redirect(url_for("index"))

@app.route("/dashboard/<uuid>")
def dashboard(uuid):
    return render_template("dashboard.html", uuid=uuid)

@app.route("/queryDBForSecurity", methods=["POST"])
def queryDBForSecurity():
    input = request.get_json()
    query = input["input"]
    result = checkStockDBWithInput(query)
    return jsonify(result)

@app.route("/addStockToWatchList", methods=["POST"])
def addStockToWatchList():
    input = request.get_json()
    symbol = input["symbol"]
    result = addStockToUserList(symbol, session['tokenID'], -1, -1)
    #default buyThreshold and sellThreshold is -1
    return jsonify(result)

@app.route("/getStockListForUser", methods=["POST"])
def getStockListForUser():
    input = request.get_json()
    token = input["token"]
    result = returnStockList(token)
    return jsonify(result)
    
@app.route("/setBuyThreshold", methods=["POST"])
def setBuyThreshold():
    input = request.get_json()
    token = input["token"]
    stockSymbol = input["stockSymbol"]
    buyThreshold = input["buyThreshold"]
    result = createBuyThreshold(stockSymbol, buyThreshold, token)
    return jsonify(result)

@app.route("/setSellThreshold", methods=["POST"])
def setSellThreshold():
    input = request.get_json()
    token = input["token"]
    stockSymbol = input["stockSymbol"]
    sellThreshold = input["sellThreshold"]
    result = createSellThreshold(stockSymbol, sellThreshold, token)
    return jsonify(result)

@app.route("/priceThresholdMet_sendEmail", methods=["POST"])
def priceThresholdMet_sendEmail():
    input = request.get_json()
    token = input["token"]
    reason = input["reason"] #is the reason to buy or sell
    print("token: " + token + " " + "reason " + reason)
    result = sendEmailToAlertUser(token, reason)
    return jsonify(result)
