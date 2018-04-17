import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { VoteTotal } from "./components/vote_total";
import { ElectionName } from "./components/election_name";
import { PrecinctsReporting } from "./components/precincts_reporting";
import { LastUpdated } from "./components/last_updated";
import { Candidate, CandidateInfo } from "./types/index";

const CAND_INFO_STR = "candidate_info";
const ELEX_NAME_STR = "elex_name";

function updateVoteTotals(electionName?: string, voteTotals?: Map<string, Candidate>, 
    precinctsReporting: number = 0, totalPrecincts: number = 0) 
{
    if (electionName)
    {
        ReactDOM.render(
            <ElectionName name={electionName} />,
            document.getElementById("election_name")
        );
    }

    if (voteTotals)
    {
        ReactDOM.render(
            <VoteTotal info={voteTotals} />,
            document.getElementById("vote_totals")
        );
    }

    ReactDOM.render(
        <PrecinctsReporting precincts_reported={precinctsReporting} total_precincts={totalPrecincts} />,
        document.getElementById("precincts_reporting")
    );

    ReactDOM.render(
        <LastUpdated />,
        document.getElementById("last_updated")
    );
}

fetch("http://localhost:5000/get_config").then(response => {
    return response.json();
}).then(cfg => {
    var candidateInfo = new Map<string, Candidate>(); 
    const candidateObj = cfg[CAND_INFO_STR];
    Object.keys(candidateObj).forEach(key => {
        candidateInfo.set(key, candidateObj[key]);
    });

    updateVoteTotals(cfg[ELEX_NAME_STR], candidateInfo);
});
