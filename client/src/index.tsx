import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { VoteTotal } from "./components/vote_total";
import { ElectionName } from "./components/election_name";
import { PrecinctsReporting } from "./components/precincts_reporting";
import { LastUpdated } from "./components/last_updated";
import { Candidate, CandidateInfo, Result } from "./types/index";

const CAND_INFO_STR = "candidate_info";
const ELEX_NAME_STR = "elex_name";
const RESULT_OBJ_NAME = "name";
const RESULT_CANDIDATE_NAME = "candidates";
const RESULT_PARTS_REPORTING = "parts_reporting";
const RESULT_TOTAL_PARTS = "total_parts";

function updateVoteTotals(electionName: string = "Election", voteTotals?: Map<string, Candidate>, 
    precinctsReporting: number = 0, totalPrecincts: number = 0) 
{
    ReactDOM.render(
        <ElectionName name={electionName} />,
        document.getElementById("election_name")
    );

    ReactDOM.render(
        <VoteTotal info={voteTotals} />,
        document.getElementById("vote_totals")
    );

    ReactDOM.render(
        <PrecinctsReporting precincts_reported={precinctsReporting} total_precincts={totalPrecincts} />,
        document.getElementById("precincts_reporting")
    );

    ReactDOM.render(
        <LastUpdated />,
        document.getElementById("last_updated")
    );
}

function convertToResult(resultObj: object): Result {
    const name = resultObj[RESULT_OBJ_NAME];
    const candidates: object = resultObj[RESULT_CANDIDATE_NAME];
    const partsReporting = resultObj[RESULT_PARTS_REPORTING];
    const totalParts = resultObj[RESULT_TOTAL_PARTS];

    // convert candidates object to Map<string, number>
    var candidateMap = new Map<string, Candidate>();
    Object.keys(candidates).forEach(key => {
        candidateMap.set(key, candidates[key]);
    });

    return new Result(name, candidateMap, partsReporting, totalParts);
}

function fetchNewResults() {
    fetch("http://localhost:5000/get_actual_count").then (response => {
        return response.json();
    }).then(response => {
        const result = convertToResult(response);
        updateVoteTotals(result.name, result.candidates, result.partsReporting, result.totalParts);
    });
}

// fetch("http://localhost:5000/get_config").then(response => {
//     return response.json();
// }).then(cfg => {
//     const result = convertToResult(cfg);
//     updateVoteTotals(result.name, result.candidates);
// });

updateVoteTotals();
fetchNewResults();
setInterval(() => fetchNewResults(), 5000);