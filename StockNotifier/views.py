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
    form = RegisterForm()
    if request.method == "POST" and form.validate():
        pass
    else:
        return render_template("register.html", form=form)

@app.route("/login")
def signin():
    form = LoginForm()
    return render_template("login.html", form=form)

@app.route("/dashboard")
def dashboard():
    return "Dashboard"

@app.route("/")
def home():
    return "change"