from flask_wtf import Form
from wtforms import StringField, IntegerField, PasswordField, SubmitField, validators

class LoginForm(Form):
    username = StringField("Username")
    password = PasswordField("Password")

class RegisterForm(Form):
    firstName = StringField("First name", id="firstName", validators=[validators.Length(min=4, max=20)])
    lastName = StringField("Last name", id="lastName", validators=[validators.Length(min=4, max=20)])
    email = StringField("Email", id="email", validators=[validators.Length(min=6, max=35)])
    username = StringField("Username", id="username", validators=[validators.Length(min=5, max=15)])
    password = PasswordField("Password", id="password", validators=[validators.Length(min=6, max=15)])
    phone = IntegerField("Phone number", id="phone")

class AddStockForm(Form):
    stockName = StringField("Stock symbol", [validators.Length(min=1, max=5)])