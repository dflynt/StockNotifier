from . import app, c, conn
from . import insertNewUser, showUsers, loginUser
from flask import render_template, request, url_for, render_template_string
from .forms import RegisterForm, LoginForm, AddStockForm
#views = Blueprint("views", __name__, template_folder="templates")

@app.route('/')
def index():
    return render_template("home.html", msg="New Message")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        firstName = request.form['firstName']
        lastName = request.form['lastName']
        email = request.form['email']
        password = request.form['password']
        phone = request.form['phone']
        if insertNewUser(str(firstName), str(lastName), str(email), str(password), str(phone), "0"):
            return render_template_string("<h5>Registered</h5>")
        else:
            return render_template_string("<h5>Already registered</h5>")
    else:
        return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def signin():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        if loginUser(email, password):
            return render_template("home.html", msg="Hello world")
        else:
            return render_template_string("<h5>Invalid login</h5>")
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    return "Dashboard"