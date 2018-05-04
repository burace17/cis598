import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { VoteTotal } from "./components/vote_total";
import { ElectionName } from "./components/election_name";
import { PrecinctsReporting } from "./components/precincts_reporting";
import { LastUpdated } from "./components/last_updated";
import { ResultMap } from "./components/map";
import { Candidate, CandidateInfo, Result } from "./types/index";
import { Config } from "./config";

const CAND_INFO_STR = "candidate_info";
const ELEX_NAME_STR = "elex_name";
const RESULT_OBJ_NAME = "name";
const RESULT_CANDIDATE_NAME = "candidates";
const RESULT_PARTS_REPORTING = "parts_reporting";
const RESULT_TOTAL_PARTS = "total_parts";
const RESULT_TOTAL_VOTES = "total_votes";

var lastResult: Result = null;
var lastForecast: Result = null;

function onMouseOverSubdiv(actual: boolean, result: Result)
{
    updateVoteTotals(false, actual, result);
}

function onMouseLeaveSubdiv(actual: boolean)
{
    updateVoteTotals(false, actual, actual? lastResult : lastForecast);
}

// Update the vote total box with the data contained in result.
// fromServer specifies whether these results are new data from the server or just a change to show results from a subdivision
// actual specifies whether these are actual results or forecasted results (different elements will be updated for both)
function updateVoteTotals(fromServer: boolean, actual: boolean, result?: Result) 
{
    const vote_totals_element_id = actual? "actual_vote_totals" : "forecast_vote_totals";
    ReactDOM.render(
        <VoteTotal result={result} />,
        document.getElementById(vote_totals_element_id)
    );

    if (actual)
    {
        ReactDOM.render(
            <ElectionName result={result} />,
            document.getElementById("election_name")
        );
    
        ReactDOM.render(
            <PrecinctsReporting result={result} />,
            document.getElementById("precincts_reporting")
        );
    }

    // If these results are from the server, we can update the last update time and save this result.
    if (fromServer)
    {
        if (actual)
            lastResult = result;
        else
            lastForecast = result;

        ReactDOM.render(
            <LastUpdated />,
            document.getElementById("last_updated")
        );
    }
}

function updateMaps(actual: boolean, resultsBySubdiv: Map<string, Result>)
{
    const result_map_element_id = actual? "actual_results_map" : "forecast_results_map";
    ReactDOM.render(
        <ResultMap voteData={resultsBySubdiv} mouseOver={onMouseOverSubdiv} mouseLeave={onMouseLeaveSubdiv} actual={actual} />,
        document.getElementById(result_map_element_id)
    );
}

function convertToResult(resultObj: object): Result 
{
    const name = resultObj[RESULT_OBJ_NAME];
    const candidates: object = resultObj[RESULT_CANDIDATE_NAME];
    const partsReporting = resultObj[RESULT_PARTS_REPORTING];
    const totalParts = resultObj[RESULT_TOTAL_PARTS];
    const totalVotes = resultObj[RESULT_TOTAL_VOTES];

    // convert candidates object to Map<string, Candidate>
    var candidateMap = new Map<string, Candidate>();
    Object.keys(candidates).forEach(key => 
    {
        candidateMap.set(key, candidates[key]);
    });

    return new Result(name, candidateMap, partsReporting, totalParts, totalVotes);
}

// Returns a Map which maps subdivision names to the 
function convertSubdivResults(resultObj: object): Map<string, Result> 
{
    var results = new Map<string, Result>();
    for (var subdiv in resultObj)
    {
        results.set(subdiv, convertToResult(resultObj[subdiv]));
    }
    return results;
}

function fetchNewResults() 
{
    fetch(Config.BACKEND_URL + "/get_actual_count").then (response => 
    {
        return response.json();
    }).then(response => 
    {
        const result = convertToResult(response);
        updateVoteTotals(true, true, result);
    });

    fetch(Config.BACKEND_URL + "/get_actual_subdiv").then (response => 
    {
        return response.json();
    }).then(response => 
    {
        const subDivResults = convertSubdivResults(response);
        updateMaps(true, subDivResults);
    });

    fetch(Config.BACKEND_URL + "/get_forecast").then (response => 
    {
        return response.json();
    }).then(response => 
    {
        const result = convertToResult(response);
        updateVoteTotals(true, false, result);
    });

    fetch(Config.BACKEND_URL + "/get_forecast_subdiv").then (response => 
    {
        return response.json();
    }).then(response => 
    {
        const subDivResults = convertSubdivResults(response);
        updateMaps(false, subDivResults);
    });
}

updateVoteTotals(true, true);
fetchNewResults();
setInterval(() => fetchNewResults(), Config.UPDATE_INTERVAL);