"""
This is the global configuration file for the election forecaster. 
Here, you may specify any variables that you wish to be available from anywhere in the app.
"""

# List of strings which should contain the names of the candidates in this election
# These should correspond with the values that will be read by the ResultReader
cand = ["LAMB, CONOR", "SACCONE, RICHARD", "MILLER, DREW GRAY"]

def candidates():
    return cand

# Name of the module containing the forecasting algorithm to use
algo = "cis598.sample_forecaster"
def forecasting_algorithm():
    return algo