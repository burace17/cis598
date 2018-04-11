from cis598.forecaster.result_reader import ResultReader
from cis598.forecaster.result import Result
import csv
import random

results_path = ""

class SimulatedElection(ResultReader):
    """
    Sample implementation of ResultReader which simply reads in election
    results from a file. Each line in the file is treated as a single precinct, with
    an associated county. 
    """
    def __init__(self):
        self.results = []
        with open(results_path, "r") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                self.results.append(row)

    def check_for_new_results(self):
        if len(self.results) > 0:
            index = random.randint(0, len(self.results)-1)
            result_dict = self.results[index]
            result = Result(["Donald Trump", "Hillary Clinton", "Gary Johnson", "Jill Stein"], name=result_dict["county"])
            result.add_votes("Donald Trump", int(result_dict["rep_votes"]))
            result.add_votes("Hillary Clinton", int(result_dict["dem_votes"]))
            result.add_votes("Gary Johnson", int(result_dict["lib_votes"]))
            result.add_votes("Jill Stein", int(result_dict["ind_votes"]))

            del self.results[index]
            return result
        else:
            return None