from . import app, c, conn
from . import insertNewUser, showUsers, loginUser, checkSecurityDBForSecurity
from flask import render_template, request, url_for, render_template_string, redirect, session
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
            session['tokenID'] = token
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
    
