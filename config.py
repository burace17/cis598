"""
This is the global configuration file for the election forecaster. 
Here, you may specify any variables that you wish to be available from anywhere in the app.
"""

# Name of the module containing the forecasting algorithm to use
model = "cis598.kansas_forecaster.kansas_model"

# Name of the module containing the result reader to use
result_reader = "cis598.kansas_forecaster.simulation"

# Names of the specific Model class and ResultReader class your implementation uses
model_class = "KansasModel"
reader_class = "SimulatedElection"

# --------------------------------------------------------
# Web app configuration.
# --------------------------------------------------------

# These values will be displayed to the user
elex_name = "KSGov"

# Define all of the candidates that will be displayed to the user here.
# The keys of the candidate_info dictionary must correspond to the names defined in the candidates array defined above.
# Use the display name to indicate how each candidate's name should be displayed to the user.
candidates = {
    "Sam Brownback": { "displayName": "Sam Brownback", "party":"Republican", "votes":0},
    "Paul Davis": { "displayName": "Paul Davis", "party":"Democratic", "votes":0},
    "Other": { "displayName": "Others", "party":"Other", "votes":0}
}

# --------------------------------------------------------
# Retrieves all of the variables used in this module and stores them in a dictionary so they can be converted easily to JSON
def toDict():
    d = {}
    attributes = globals()
    for var in attributes:
        if not var.startswith("__") and (type(attributes[var]) == str or type(attributes[var]) == dict):
            d[var] = attributes[var]
    return d