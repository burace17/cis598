"""
This is the global configuration file for the election forecaster. 
Here, you may specify any variables that you wish to be available from anywhere in the app.
"""

# List of strings which should contain the names of the candidates in this election
# These should correspond with the values that will be read by the ResultReader
candidates = ["LAMB, CONOR", "SACCONE, RICHARD", "MILLER, DREW GRAY"]

# Name of the module containing the forecasting algorithm to use
model = "cis598.sample_forecaster.sample_model"

# Name of the module containing the result reader to use
result_reader = "cis598.sample_forecaster.pa_sos_reader"

# Names of the specific Model class and ResultReader class your implementation uses
model_class = "SampleModel"
reader_class = "PAReader"

# --------------------------------------------------------
# Web app configuration.
# --------------------------------------------------------

# These values will be displayed to the user
elex_name = "Pennsylvania's 18th Congressional District Special Election"
candidate_info = {
    "SACCONE, RICHARD": { "display_name": "Rick Saccone", "party":"Republican"},
    "LAMB, CONNOR": { "display_name": "Conor Lamb", "party":"Democratic"},
    "MILLER, DREW GRAY": { "display_name": "Drew Gray Miller", "party":"Libertarian"}
}