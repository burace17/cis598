import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { VoteTotal } from "./components/vote_total";
import { Candidate, CandidateInfo } from "./types/index";

const CAND_INFO_STR = "candidate_info";

fetch("http://localhost:5000/get_config").then(response => {
    return response.json();
}).then(cfg => {
    var candidateInfo = new Map<string, Candidate>(); 
    const candidateObj = cfg[CAND_INFO_STR];
    Object.keys(candidateObj).forEach(key => {
        candidateInfo.set(key, candidateObj[key]);
    });

    ReactDOM.render(
        <VoteTotal info={candidateInfo} />,
        document.getElementById("vote_totals")
    );
});
