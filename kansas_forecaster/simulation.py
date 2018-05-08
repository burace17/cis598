from cis598.forecaster.result_reader import ResultReader
from cis598.forecaster.result import Result
from cis598 import config
import csv
import random

results_path = "./kansas_forecaster/2014_gov_results.csv"

class SimulatedElection(ResultReader):
    """
    Sample implementation of ResultReader which simply reads in election
    results from a file. Each line in the file is treated as a single precinct, with
    an associated county. 
    """
    def __init__(self):
        self.results = []
        random.seed(134)
        with open(results_path, "r") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                self.results.append(row)
            print(len(self.results))
        self.index = 0

    def check_for_new_results(self):
        if len(self.results) > 0:
            #index = random.randint(0, len(self.results)-1)
            result_dict = self.results[self.index]
            self.index += 1
            result = Result(config.candidates, name=result_dict["county"].title())
            result.add_votes("Sam Brownback", int(result_dict["rep_votes"]))
            result.add_votes("Paul Davis", int(result_dict["dem_votes"]))
            result.add_votes("Other", int(result_dict["lib_votes"]))

            del self.results[self.index]
            return result
        else:
            return None