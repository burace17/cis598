from cis598.forecaster.model import Model
from cis598.forecaster.result import Result
from cis598 import config
import csv
import copy

republican = "SACCONE, RICHARD"
democrat = "LAMB, CONOR"

class SampleModel(Model):
    def __init__(self, result_reader):
        self.result_reader = result_reader
        self.turnout_prediction = 230000

        self.actual_overall = Result(config.candidates, "PA18")
        self.actual_counties = {
            "ALLEGHENY":Result(config.candidates, "ALLEGHENY"),
            "GREENE":Result(config.candidates, "GREEN"),
            "WASHINGTON":Result(config.candidates, "WASHINGTON"),
            "WESTMORELAND":Result(config.candidates, "WESTMORELAND")
        }

        self.benchmark_overall = Result(config.candidates, "PA18")
        self.benchmark_counties = {
            "ALLEGHENY":Result(config.candidates, "ALLEGHENY"),
            "GREENE":Result(config.candidates, "GREEN"),
            "WASHINGTON":Result(config.candidates, "WASHINGTON"),
            "WESTMORELAND":Result(config.candidates, "WESTMORELAND")
        }

        # Read in benchmark results.
        with open("/home/blair/cis598/sample_forecaster/benchmark.csv") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                county_name = row["County"]
                lean = float(row["Avglean"])
                pct_final = float(row["PercentOfFinal"])
                benchmark_vote_total = pct_final * self.turnout_prediction
                rep_per = 0.5 + lean
                dem_per = 0.99 - rep_per

                rep_votes = rep_per * benchmark_vote_total
                dem_votes = dem_per * benchmark_vote_total
                lib_votes = 0.01 * benchmark_vote_total
                self.benchmark_counties[county_name].add_votes("LAMB, CONOR", dem_votes)
                self.benchmark_counties[county_name].add_votes("SACCONE, RICHARD", rep_votes)
                self.benchmark_counties[county_name].add_votes("MILLER, DREW GRAY", lib_votes)
                self.benchmark_overall.add_votes("LAMB, CONOR", dem_votes)
                self.benchmark_overall.add_votes("SACCONE, RICHARD", rep_votes)
                self.benchmark_overall.add_votes("MILLER, DREW GRAY", lib_votes)
        
            self.predicted_overall = copy.deepcopy(self.benchmark_overall)
            self.predicted_counties = copy.deepcopy(self.benchmark_counties)



    def update_forecast(self):
        new_results = self.result_reader.check_for_new_results()
        self.actual_overall = new_results[0]
        self.actual_counties = new_results[1]

        for county,result in self.actual_counties.items():
           if result.parts_reporting == result.total_parts:
               self.predicted_counties[county] = copy.deepcopy(result)
           elif result.parts_reporting > 0:
                bench_r_delta = self.actual_counties[county].get_percentage(republican) - self.benchmark_counties[county].get_percentage(republican)
                bench_r_delta *= result.parts_reporting / result.total_parts
                new_r_per = self.benchmark_counties[county].get_percentage(republican) + bench_r_delta
                new_d_per = 0.99 - new_r_per
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