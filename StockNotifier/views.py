from . import app
from . import c, conn
from flask import render_template, request, url_for
from .forms import RegisterForm, LoginForm, AddStockForm
#views = Blueprint("views", __name__, template_folder="templates")

@app.route('/home')
def index():
    
    return render_template("home.html", msg="New Message")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST" and form.validate():
        firstName = request.form['firstName']
        lastName = request.form['lastName']
        email = request.form['email']
        username = request.form['username']
        password = request.form['username']
        phone = request.form['phone']
        print(firstName + " " + lastName)
    else:
        return render_template("register.html")

@app.route("/login")
def signin():
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    return "Dashboard"

@app.route("/")
def home():
    return "change"