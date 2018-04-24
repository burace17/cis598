import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { VoteTotal } from "./components/vote_total";
import { ElectionName } from "./components/election_name";
import { PrecinctsReporting } from "./components/precincts_reporting";
import { LastUpdated } from "./components/last_updated";
import { ResultMap } from "./components/map";
import { Candidate, CandidateInfo, Result } from "./types/index";

const CAND_INFO_STR = "candidate_info";
const ELEX_NAME_STR = "elex_name";
const RESULT_OBJ_NAME = "name";
const RESULT_CANDIDATE_NAME = "candidates";
const RESULT_PARTS_REPORTING = "parts_reporting";
const RESULT_TOTAL_PARTS = "total_parts";
const RESULT_TOTAL_VOTES = "total_votes";

const UPDATE_INTERVAL = 20000;

var lastResult: Result = null;

function onMouseOverSubdiv(result: Result)
{
    updateVoteTotals(false, result);
}

function onMouseLeaveSubdiv()
{
    updateVoteTotals(false, lastResult);
}

function updateVoteTotals(fromServer: boolean, result?: Result) 
{
    ReactDOM.render(
        <ElectionName result={result} />,
        document.getElementById("election_name")
    );

    ReactDOM.render(
        <VoteTotal result={result} />,
        document.getElementById("vote_totals")
    );

    ReactDOM.render(
        <PrecinctsReporting result={result} />,
        document.getElementById("precincts_reporting")
    );

    // If these results are from the server, we can update the last update time and save this result.
    if (fromServer)
    {
        lastResult = result;
        ReactDOM.render(
            <LastUpdated />,
            document.getElementById("last_updated")
        );
    }
   

}

function updateMaps(resultsBySubdiv: Map<string, Result>)
{
    ReactDOM.render(
        <ResultMap voteData={resultsBySubdiv} mouseOver={onMouseOverSubdiv} mouseLeave={onMouseLeaveSubdiv} />,
        document.getElementById("actual_results_map")
    );
}

function convertToResult(resultObj: object): Result {
    const name = resultObj[RESULT_OBJ_NAME];
    const candidates: object = resultObj[RESULT_CANDIDATE_NAME];
    const partsReporting = resultObj[RESULT_PARTS_REPORTING];
    const totalParts = resultObj[RESULT_TOTAL_PARTS];
    const totalVotes = resultObj[RESULT_TOTAL_VOTES];

    // convert candidates object to Map<string, Candidate>
    var candidateMap = new Map<string, Candidate>();
    Object.keys(candidates).forEach(key => {
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

function fetchNewResults() {
    fetch("http://localhost:5000/get_actual_count").then (response => {
        return response.json();
    }).then(response => {
        const result = convertToResult(response);
        updateVoteTotals(true, result);
    });

    fetch("http://localhost:5000/get_actual_subdiv").then (response => {
        return response.json();
    }).then(response => {
        const subDivResults = convertSubdivResults(response);
        updateMaps(subDivResults);
    });
}

updateVoteTotals(true);
fetchNewResults();
setInterval(() => fetchNewResults(), UPDATE_INTERVAL);