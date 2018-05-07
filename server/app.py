from flask import Flask
from flask import render_template
from flask_cors import CORS
from flask_cors import cross_origin
from cis598 import config
from cis598.forecaster.model import Model
from cis598.forecaster.result_reader import ResultReader
import importlib
import threading
import time
import json

app = Flask(__name__, static_url_path="/static")
CORS(app)

model_module = importlib.import_module(config.model)
result_module = importlib.import_module(config.result_reader)

result_reader = getattr(result_module, config.reader_class)()
model = getattr(model_module, config.model_class)(result_reader)

actual_count_json = ""
forecast_count_json = ""
actual_subdiv_json = ""
forecast_subdiv_json = ""

def update_forecast():
    global actual_count_json
    global forecast_count_json
    global actual_subdiv_json
    global forecast_subdiv_json
    while True:
        model.update_forecast()
        actual_count_json = json.dumps(model.get_actual_count().toDict())
        forecast_count_json = json.dumps(model.get_forecast().toDict())
        actual_subdiv_json = json.dumps(model.get_actual_subdiv())
        forecast_subdiv_json = json.dumps(model.get_forecast_subdiv())
        time.sleep(config.update_interval)

threading.Thread(target=update_forecast).start()

@app.route("/get_actual_count")
def actual_count():
    return actual_count_json

@app.route("/get_forecast")
def forecast():
    return forecast_count_json

@app.route("/get_config")
@cross_origin()
def get_config():
    return json.dumps(config.toDict())

@app.route("/get_actual_subdiv")
def actual_subdiv():
    return actual_subdiv_json

@app.route("/get_forecast_subdiv")
def forecast_subdiv():
    return forecast_subdiv_json