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

function updateVoteTotals(electionName: string = "Election", voteTotals?: CandidateInfo, 
    precinctsReporting: number = 0, totalPrecincts: number = 0, totalVotes: number = 0) 
{
    ReactDOM.render(
        <ElectionName name={electionName} />,
        document.getElementById("election_name")
    );

    ReactDOM.render(
        <VoteTotal info={voteTotals} totalVotes={totalVotes} />,
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

    ReactDOM.render(
        <ResultMap voteData={voteTotals} />,
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

function fetchNewResults() {
    fetch("http://localhost:5000/get_actual_count").then (response => {
        return response.json();
    }).then(response => {
        const result = convertToResult(response);
        updateVoteTotals(result.name, result.candidates, result.partsReporting, result.totalParts, result.totalVotes);
    });
}

updateVoteTotals();
fetchNewResults();
setInterval(() => fetchNewResults(), UPDATE_INTERVAL);