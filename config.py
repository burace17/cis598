"""
This is the global configuration file for the election forecaster. 
Here, you may specify any variables that you wish to be available from anywhere in the app.
"""

# List of strings which should contain the names of the candidates in this election
# These should correspond with the values that will be read by the ResultReader
cand = ["LAMB, CONOR", "SACCONE, RICHARD", "MILLER, DREW GRAY"]

# Name of the module containing the forecasting algorithm to use
mod = "cis598.sample_forecaster.sample_model"

# Name of the module containing the result reader to use
reader = "cis598.sample_forecaster.pa_sos_reader"

# Names of the specific Model class and ResultReader class your implementation uses
mod_class = "SampleModel"
read_class = "PAReader"

def candidates():
    return cand

def model():
    return mod

def result_reader():
    return reader

def model_class():
    return mod_class

def reader_class():
    return read_class