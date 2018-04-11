from flask import Flask
from cis598 import config
import importlib

app = Flask(__name__)

importlib.import_module(config.forecasting_algorithm())

@app.route("/")
def hello_world():
    return "Hello world"