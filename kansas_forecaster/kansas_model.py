from cis598.forecaster.model import Model
from cis598.forecaster.result import Result
from cis598 import config
import csv
import copy

republican = "Sam Brownback"
democrat = "Paul Davis"

class KansasModel(Model):
    def __init__(self, result_reader):
        self.result_reader = result_reader
        self.turnout_prediction = 230000

        self.actual_overall = Result(config.candidates, "Kansas Governor", 0, 3428)
        self.actual_counties = {}

        self.benchmark_overall = Result(config.candidates, "Kansas Governor")
        self.benchmark_counties = {}

        # Read in benchmark results.
        with open("./kansas_forecaster/benchmark.csv") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                county_name = row["county"].lower()
               
                self.benchmark_counties[county_name] = Result(config.candidates, county_name, 0, int(row["precinct_count"]))
                self.actual_counties[county_name] = Result(config.candidates, county_name, 0, int(row["precinct_count"]))

                self.benchmark_counties[county_name].add_votes(democrat, int(row["14_dem_votes"]))
                self.benchmark_counties[county_name].add_votes(republican, int(row["14_rep_votes"]))
                self.benchmark_counties[county_name].add_votes("Other", int(row["14_oth_votes"]))
                self.benchmark_overall.add_votes(democrat, int(row["14_dem_votes"]))
                self.benchmark_overall.add_votes(republican, int(row["14_rep_votes"]))
                self.benchmark_overall.add_votes("Other", int(row["14_oth_votes"]))
        
            self.predicted_overall = copy.deepcopy(self.benchmark_overall)
            self.predicted_counties = copy.deepcopy(self.benchmark_counties)



    def update_forecast(self):
        new_results = self.result_reader.check_for_new_results()
        
        self.actual_overall = self.actual_overall + new_results
        self.actual_overall.parts_reporting += 1

        self.actual_counties[new_results.name.lower()] = self.actual_counties[new_results.name.lower()] + new_results
        self.actual_counties[new_results.name.lower()].parts_reporting += 1

        #self.actual_overall = new_results[0]
        #self.actual_counties = new_results[1]

        for county,result in self.actual_counties.items():
           county = county.lower()
           if result.parts_reporting == result.total_parts:
               self.predicted_counties[county] = copy.deepcopy(result)
           elif result.parts_reporting > 0:
                bench_r_delta = self.actual_counties[county].get_percentage(republican) - self.benchmark_counties[county].get_percentage(republican)
                bench_r_delta *= result.parts_reporting / result.total_parts

                new_r_per = self.benchmark_counties[county].get_percentage(republican) + bench_r_delta
                # (100% - Third Party Percentage) - Republican Percentage = Democratic Percentage
                new_d_per = (1.0 - self.benchmark_counties[county].get_percentage("Other")) - new_r_per
                new_r_votes = new_r_per * self.benchmark_counties[county].get_total_votes()
                new_d_votes = new_d_per * self.benchmark_counties[county].get_total_votes()

                self.predicted_counties[county].set_votes(republican, new_r_votes)
                self.predicted_counties[county].set_votes(democrat, new_d_votes)

        self.predicted_overall.clear_votes()
        for county,result in self.predicted_counties.items():
            self.predicted_overall = self.predicted_overall + result

    def get_actual_count(self):
        return self.actual_overall

    def get_forecast(self):
        return self.predicted_overall

    def get_actual_subdiv(self):
        ret = {}
        for county,result in self.actual_counties.items():
            ret[county] = result.toDict()
        return ret
    
    def get_forecast_subdiv(self):
        ret = {}
        for county,result in self.predicted_counties.items():
            ret[county] = result.toDict()
        return ret