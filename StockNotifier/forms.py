from flask_wtf import Form
from wtforms import StringField, IntegerField, PasswordField, SubmitField, validators

class LoginForm(Form):
    username = StringField("Username")
    password = PasswordField("Password")

class RegisterForm(Form):
    firstName = StringField("First name", [validators.Length(min=4, max=20)])
    lastName = StringField("Last name", [validators.Length(min=4, max=20)])
    email = StringField("Email", [validators.Length(min=6, max=35)])
    username = StringField("Username", [validators.Length(min=5, max=15)])
    password = PasswordField("Password", [validators.Length(min=6, max=15)])
    phone = IntegerField("Phone number", [validators.Length(min=7, max=15)])

class AddStockForm(Form):
    stockName = StringField("Stock symbol", [validators.Length(min=1, max=5)])