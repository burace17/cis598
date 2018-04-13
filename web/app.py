from flask import Flask
from cis598 import config
from cis598.forecaster.model import Model
from cis598.forecaster.result_reader import ResultReader
import importlib

app = Flask(__name__)

model_module = importlib.import_module(config.model())
result_module = importlib.import_module(config.result_reader())

result_reader = getattr(result_module, config.reader_class())()
model = getattr(model_module, config.model_class())(result_reader)

@app.route("/")
def hello_world():
    model.update_forecast()
    return str(model.get_actual_count().get_percentage_summary())