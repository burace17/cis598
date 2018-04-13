"""
Implementation of ResultReader which pulls results from the Pennsylvania Secretary of State website.
"""
from cis598.forecaster.result_reader import ResultReader
from cis598.forecaster.result import Result
from cis598 import config
import urllib.request
import json

sos_url = "http://www.electionreturns.pa.gov/api/ElectionReturn/GetCountyBreak?officeId=0&districtId=19&methodName=GetCountyBreak&electionid=undefined&electiontype=undefined&isactive=undefined"
reporting_url = "http://www.electionreturns.pa.gov/api/ElectionReturn/GetDashboardMessage?countyName=&methodName=GetDashboardMessage&electionid=undefined&electiontype=undefined&isactive=undefined"

class PAReader(ResultReader):
    def check_for_new_results(self):
        request = urllib.request.urlopen(sos_url)
        request_str = request.read().decode("utf-8")
        request_str2 = json.loads(request_str)
        request_dict = json.loads(request_str2) # ?????
        county_arr = request_dict["Election"]["18th Congressional District"]
        
        overall_results = Result(config.candidates, "PA-18")
        overall_counties = {
            "ALLEGHENY":Result(["LAMB, CONOR", "SACCONE, RICHARD", "MILLER, DREW GRAY"], "ALLEGHENY"),
            "GREENE":Result(["LAMB, CONOR", "SACCONE, RICHARD", "MILLER, DREW GRAY"], "GREEN"),
            "WASHINGTON":Result(["LAMB, CONOR", "SACCONE, RICHARD", "MILLER, DREW GRAY"], "WASHINGTON"),
            "WESTMORELAND":Result(["LAMB, CONOR", "SACCONE, RICHARD", "MILLER, DREW GRAY"], "WESTMORELAND")
        }

        for county_dict in county_arr:
            for county in county_dict.keys():
                county_results = county_dict[county]
                url = "http://www.electionreturns.pa.gov/api/ElectionReturn/GetCountyMessageData?countyName="+county+"&methodName=GetCountyMessageData&electionid=undefined&electiontype=S&isactive=undefined"
                request = urllib.request.urlopen(url)
                request_str = request.read().decode("utf-8")
                request_str2 = json.loads(request_str)
                request_dict = json.loads(request_str2) # ?????

                overall_counties[county].parts_reporting = int(request_dict["ReportingDistrict"])
                overall_counties[county].total_parts = int(request_dict["VotingDistrict"])
                for candidate in county_results:
                    overall_results.add_votes(candidate["CandidateName"].strip(),int(candidate["Votes"]))
                    overall_counties[county].add_votes(candidate["CandidateName"].strip(),int(candidate["Votes"]))

        request = urllib.request.urlopen(reporting_url)
        request_str = request.read().decode("utf-8")
        request_str2 = json.loads(request_str)
        request_dict = json.loads(request_str2) # ?????

        precincts_reporting = int(request_dict["ReportingDistrict"])
        total_precincts = int(request_dict["VotingDistrict"])
        overall_results.parts_reporting = precincts_reporting
        overall_results.total_parts = total_precincts
        return (overall_results, overall_counties)
